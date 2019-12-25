import { Component, OnInit } from '@angular/core';
import { MarketService } from '../market/market.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  private time: number = 0;
  private timeIsSet: boolean = false;
  private days:string = "00";

  constructor(private marketService: MarketService) { }

  ngOnInit() {
    this.marketService.getInfoForAuction()
      .subscribe(response => {
        const dateNow = new Date();
        this.time = (new Date(response.startTime).getTime() - dateNow.getTime()) / 1000;
        this.days = "" + (new Date(response.startTime).getDay() - dateNow.getDay());
      })
  }


}
