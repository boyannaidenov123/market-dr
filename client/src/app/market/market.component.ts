import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  private isTrader_;
  private isTraderSub: Subscription;

  constructor(public authService: AuthService){}

  ngOnInit() {
    this.authService.getIsTrader();
    this.isTraderSub = this.authService.getIsTraderListener()
    .subscribe(isTrader =>{
      this.isTrader_ = isTrader;
    })
    
  }

  isTrader(){
    return this.isTrader_;
  }
  ngOnDestroy(): void {
    this.isTraderSub.unsubscribe();
  }

}

