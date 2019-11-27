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
  private isTrader:boolean = false;

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
    getIsTrader(){
      return this.isTrader;
    }

  signup(email:string, password:string, isTrader:boolean){
    console.log("signup");
    const newUser:User = {
      email: email,
      password:password,
      isTrader: isTrader
    };
    this.http.post<{message:string, result:any}>("http://localhost:9000/users/signup", newUser)
    .subscribe(response =>{
      console.log(response.message);
    })
  }

  login(email:string, password:string, isTrader:boolean){
    console.log("login");
    const user:User = {
      email:email,
      password:password,
      isTrader: isTrader
    };
    this.http.post<{token:string, expiresIn:number, userId:string, isTrader:boolean}>("http://localhost:9000/users/login", user)
    .subscribe(response =>{
      const token = response.token;
      this.token = token;
      const isTrader = response.isTrader;
      this.isTrader = isTrader;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);

        const now = new Date();
        const expiresDate = new Date(now.getTime() + expiresInDuration*1000);
        console.log(this.token);

        this.saveAuthData(token, expiresDate, this.userId);
        this.router.navigate(['/market']);
      }
    })
      
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
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

}
