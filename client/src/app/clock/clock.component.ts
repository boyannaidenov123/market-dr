import { Component, OnInit } from '@angular/core';
import {SocketService} from './socket.service';
import { Product } from '../products/product.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  progress;
  progressBar = document.querySelector('.progress-bar');
  private lotId:string;
  private userId:string;
  private containers:number = 1;
  private product:Product;

  private countUsers;

  displayedColumns: string[] = ['name', 'type', 'containers', 'items', 'height', 'weight', 'price', 'minPrice', 'blockPrice', 'auctionName'];
  dataSource = new MatTableDataSource<Product>([]);  

  constructor(private SocketService :SocketService){}


  ngOnInit() {
    console.log(Date());

    //Connect socket
    this.SocketService.listen('connection')
    .subscribe((res:any) => {
      console.log(res);
    })

    //Get clock value
    this.SocketService.listen('clockValue')
    .subscribe((res:any) => {
      this.progress = res.value;
      this.product.price = (res.value * this.product.blockPrice);
      this.dataSource = new MatTableDataSource<Product>([this.product]);  
    })

    //Get which Lot is for sale
    this.SocketService.listen('lotForSale')
    .subscribe((res:any) => {
      console.log(res);
      this.progress = res.currentPrice;
      this.lotId = res._id;
      //trqbva da ocvetq dadeniq Flower v tablicata 
    })
    //Get which Lot is for sale
    this.SocketService.listen('flowerForSale')
    .subscribe((res:any) => {
      console.log(res);

      this.product = {
        name: res.name,
        type: res.type,
        containers: res.containers,
        itemsInContainer: res.itemsInContainer,
        height: res.height, 
        weight: res.weight,
        minPrice: (10*res.blockPrice),
        blockPrice: res.blockPrice,
        auctionName: res.auctionName
      }
      this.dataSource = new MatTableDataSource<Product>([this.product]);
      console.log(this.product);

    })

    this.SocketService.listen('countUsers')
    .subscribe((res:any) => {
       this.countUsers = res.countUsers;
       console.log(this.countUsers)
    });

    this.SocketService.sent('connectUser', {});
   
  }
  onBuyLot(){
    this.userId = localStorage.getItem("userId");
    if(!this.containers || this.containers <= 0){
      this.containers = 1;
    }
    console.log(this.containers);
    //Buy lot
    this.SocketService.sent('buyLot', {
      userId: this.userId,
      containers: this.containers,
    });
  }

  ngOnDestroy() {

  }
}
