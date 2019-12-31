import { Component, OnInit } from '@angular/core';
import {SocketService} from './socket.service';

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
  private countUsers=0;
  constructor(private srv :SocketService){}


  ngOnInit() {
    console.log(Date());

    //Connect socket
    this.srv.listen('connection')
    .subscribe((res:any) => {
      console.log(res);
    })

    //Get clock value
    this.srv.listen('clockValue')
    .subscribe((res:any) => {
      console.log(res.value);
      this.progress = res.value;
    })

    //Get which Lot is for sale
    this.srv.listen('lotForSale')
    .subscribe((res:any) => {
      console.log(res);
      this.progress = res.currentPrice;
      this.lotId = res._id;
      //trqbva da ocvetq dadeniq Flower v tablicata 
    })

    this.srv.listen('countUsers')
    .subscribe((res:any) => {
       this.countUsers = res.countUsers;
    })

   
  }
  onBuyLot(){
    this.userId = localStorage.getItem("userId");
    //Buy lot
    this.srv.sent('buyLot', {lotId: this.lotId, userId: this.userId});
  }

  ngOnDestroy() {

  }
}
