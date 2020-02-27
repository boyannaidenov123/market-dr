import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from './time.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) {}

  changeStartTimeAuctions(time: Time){
    return this.http.put<{message: string}>("http://localhost:9000/auction", time);
  }


}
