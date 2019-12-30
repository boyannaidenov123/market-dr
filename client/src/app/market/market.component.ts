import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MarketService } from './market.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  private isTrader_;
  private isTraderSub: Subscription;
  private activate = false;

  constructor(private authService: AuthService, private marketService: MarketService){}

  ngOnInit() {
    this.authService.getIsTrader();
    this.isTraderSub = this.authService.getIsTraderListener()
    .subscribe(isTrader =>{
      this.isTrader_ = isTrader;
    })

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

  isTrader(){
    return this.isTrader_;
  }
  ngOnDestroy(): void {
    this.isTraderSub.unsubscribe();
  }

}

