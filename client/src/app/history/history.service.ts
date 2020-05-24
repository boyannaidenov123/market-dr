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

  getBuyerHistory(productsPerPage: number, currentPage: number, isTrader: boolean) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&isTrader=${isTrader}`;
    console.log(queryParams);
    this.http.get<{message:string, flowers: any, maxFlowers:number, isTrader:boolean}>("http://localhost:9000/history/" + queryParams)
    .pipe(
      map(flowersData => {
        console.log(flowersData);
        return {
          flowers: flowersData.flowers.map(flower =>{
            return {
              historyID: flower._id,
              seller: flower.seller.email,
              buyer: flower.buyer.email,
              name: flower.flowerId.name,
              type: flower.flowerId.type,
              id: flower.flowerId._id,
              containers: flower.containers,
              itemsInContainer: flower.flowerId.itemsInContainer,
              height: flower.flowerId.height,
              weight: flower.flowerId.weight,
              auctionName: flower.auctionName,
              imagePath: flower.flowerId.imagePath,
              price: flower.price * flower.containers,
              date: this.formatDate(flower.date),
              transaction: flower.transaction
            };
          }),
          maxFlowers: flowersData.maxFlowers
        }
      })
    )
    .subscribe(transformedFlowers =>{
      console.log(transformedFlowers.flowers)
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


  createPayment(historyId: string){
    return this.http.post<{id: string}>("http://localhost:9000/history/createPayment", {historyId: historyId});
  }

}
