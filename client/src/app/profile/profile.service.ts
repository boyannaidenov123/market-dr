import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserInfo(){
    return this.http.get<{email:string, name:string, isTrader:boolean}>("http://localhost:9000/users/info");
  }

}
