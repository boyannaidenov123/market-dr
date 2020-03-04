import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private isAuthenticated:boolean = false;
  private userId:string;
  private tokenTimer:any;
  private authStatusListener = new Subject<boolean>();
  private isTraderListener = new Subject<boolean>();
  private isAdminListener = new Subject<boolean>();

  private isAdmin:boolean = false;

  constructor(
    private router:Router,
    public http:HttpClient
    ) { }

    getToken(){
      return this.token;
    }
    getIsAuth(){
      return this.isAuthenticated;
    }
    getAuthStatusListener(){
      return this.authStatusListener;
    }
    getUserId(){
      return this.userId;
    }
    getIsTraderListener(){
      return this.isTraderListener;
    }
    getIsAdmin_(){
      return this.isAdmin;
    }
    getIsAdminListener(){
      return this.isAdminListener;
    }

  signup(email:string, password:string, isTrader:boolean){
    console.log("signup");
    const newUser:User = {
      email: email,
      password:password,
      isTrader: isTrader
    };
    this.http.post<{message:string, result:any, signup:boolean}>("http://localhost:9000/users/signup", newUser)
    .subscribe(response =>{
      console.log(response.message);
      if(response.signup){
        return true;
      }
      return false;
    })
  }
  getAccess(email: string, code: string){
    const user = {
      email: email,
      code: code
    }
    this.http.post<{message:string, signup:boolean}>("http://localhost:9000/users/access", user)
    .subscribe(response =>{
      console.log(response.message);
      if(response.signup){
        this.router.navigate(['/profile']);
      }
    })
  }

  login(email:string, password:string, isTrader:boolean){
    console.log("login");
    const user:User = {
      email:email,
      password:password,
      isTrader: isTrader
    };
    this.http.post<{token:string, expiresIn:number, userId:string, isAdmin:boolean}>("http://localhost:9000/users/login", user)
    .subscribe(response =>{
      console.log(response)
      const token = response.token;
      this.token = token;

      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        this.isAdmin = response.isAdmin;
        this.isAdminListener.next(response.isAdmin);

        const now = new Date();
        const expiresDate = new Date(now.getTime() + expiresInDuration*1000);
        console.log(this.token);

        this.saveAuthData(token, expiresDate, this.userId);
        this.router.navigate(['/profile']);
      }
    })
      
  }
  
  getIsTrader():any{
    this.http.get<{isTrader: boolean}>("http://localhost:9000/users/isTrader")
    .subscribe(response =>{
      this.isTraderListener.next(response.isTrader);
    })
  }

  getIsAdmin(){
    return this.http.get<{isAdmin: boolean}>("http://localhost:9000/users/isAdmin");

  }

  authAuthUser(){
    const authInformation = this.getAuthData();
    
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiresData.getTime() - now.getTime();
    if(expiresIn > 0){//ako sesiqta e validna o6te
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.getIsAdmin().subscribe(result => {
        this.isAdmin = result.isAdmin;
        this.isAdminListener.next(result.isAdmin)
        console.log(this.isAdmin)
      })
    }
  }




  getAuthData(){
    const token = localStorage.getItem("token");
    const expiresData = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expiresData){
      return;
    }
    return {
      token:token,
      expiresData:new Date(expiresData),
      userId: userId
    }
  }

  setAuthTimer(duration: number):void{
    this.tokenTimer = setTimeout(() =>{
      this.logout();
    }, (duration*1000))
  }
  private saveAuthData(token:string, expiresDate: Date, userId:string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiresDate.toISOString());
    localStorage.setItem("userId", userId);
  }
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.isTraderListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

}
