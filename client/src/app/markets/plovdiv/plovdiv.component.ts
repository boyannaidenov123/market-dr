import { Component, OnInit } from '@angular/core';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-plovdiv',
  templateUrl: './plovdiv.component.html',
  styleUrls: ['./plovdiv.component.css']
})
export class PlovdivComponent implements OnInit {

  private activate = false;
  auction:string = "Plovdiv";

  constructor(private marketService: MarketService){}

  ngOnInit() {
    this.marketService.getInfoForAuction(this.auction)
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
