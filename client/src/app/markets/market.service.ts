import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http:HttpClient) { }


  getInfoForAuction(auction:string){
    let queryParams = `?auction=${auction}`;
    return this.http.get<{startTime:Date, activate:boolean}>("http://localhost:9000/auction/" + queryParams);
  }

}
