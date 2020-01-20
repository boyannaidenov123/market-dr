import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private flowers: any = [];
  private flowersUpdated = new Subject<{
    flowers: any;
    flowersCount: number;
  }>();

  constructor(private http: HttpClient) { }

  getBuyerHistory(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    
    this.http.get<{message:string, flowers: any, maxFlowers:number}>("http://localhost:9000/history/buyerHistory" + queryParams)
    .pipe(
      map(flowersData => {
        return {
          flowers: flowersData.flowers.map(flower =>{
            return {
              seller: flower.seller.email,
              name: flower.flowerId.name,
              type: flower.flowerId.type,
              id: flower.flowerId._id,
              containers: flower.containers,
              itemsInContainer: flower.flowerId.itemsInContainer,
              height: flower.flowerId.height,
              weight: flower.flowerId.weight,
              auctionName: flower.flowerId.auctionName,
              imagePath: flower.flowerId.imagePath,
              price: flower.price,
              date: this.formatDate(flower.date)
            };
          }),
          maxFlowers: flowersData.maxFlowers
        }
      })
    )
    .subscribe(transformedFlowers =>{
      console.log(transformedFlowers.maxFlowers)
      this.flowers = transformedFlowers.flowers;
      this.flowersUpdated.next({
        flowers: [...this.flowers],
        flowersCount: transformedFlowers.maxFlowers
      })
    })
  }
  getFlowersUpdatedListener() {
    return this.flowersUpdated.asObservable();
  }
  formatDate(date:Date) {
    var day = new Date(date).getDate();
    var monthIndex = new Date(date).getMonth() + 1;
    var year = new Date(date).getFullYear();
  
    return day + '/' + monthIndex + '/' + year;
  }

}
