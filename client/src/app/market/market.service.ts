import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http:HttpClient) { }

  getFlowersForSell(){
    this.http.get("http://localhost:9000/flowers/getFlowers")
    .subscribe(flowers =>{
      
    })
  }

}
