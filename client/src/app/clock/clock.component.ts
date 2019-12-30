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
  intervalId;
  constructor(private srv :SocketService){}


  ngOnInit() {
    console.log(Date());


    this.srv.listen('connection')
    .subscribe((res:any) => {
      console.log(res);
    })
    this.srv.listen('clockValue')
    .subscribe((res:any) => {
      console.log(res.value);
      this.progress = res.value;
    })

    this.srv.listen('lotForSale')
    .subscribe((res:any) => {
      console.log(res);
      this.progress = res.currentPrice;
    })
   




































    
    //this.clockService.sendMessage('connection', "zdr");
    
  /*  this.clockService.onNewMessage("newMessage")
    .subscribe(msg => {
      console.log(msg);
    })*/
    





 /*   const getDownloadProgress = () => {
      //console.log('getDownload', this);
      if (this.progress >= 0) {
        //console.log('inside if', this.progress);
        this.progress = this.progress;
      }
      else {
        clearInterval(this.intervalId);
      }
      if(this.progress == 30){
        this.progress += 50;
      }
    }
    this.intervalId = setInterval(getDownloadProgress, 100);*/
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
