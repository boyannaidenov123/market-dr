import {Component, OnInit} from '@angular/core';
import { MarketService } from './market.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  
  
  private activate = false;

  constructor(private marketService: MarketService){}

  ngOnInit() {
    this.marketService.getInfoForAuction()
    .subscribe(response =>{
      console.log(response)
      this.activate = response.activate;
      if(!response.activate){
        setTimeout(() =>{
          this.activate = true;
        }, ((new Date(response.startTime).getTime() - Date.now())))
      }
    })
    
  }


}

