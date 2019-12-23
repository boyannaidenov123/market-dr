import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserInfo(){
    return this.http.get<{email:string, name:string, isTrader:boolean}>("http://localhost:9000/profile/info");
  }
  changeName(name: string){
    console.log(name);
    return this.http.post<{message: string, name: string}>("http://localhost:9000/profile/changeName", {name:name});
  }
  changePassword(password:string, newPassword){
    const passwords = {
      password:password,
      newPassword:newPassword
    };
    return this.http.post<{message:string}>("http://localhost:9000/profile/changePassword", passwords);
  }

}
