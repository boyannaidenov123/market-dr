import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  constructor(public authService: AuthService){}

  ngOnInit() {
  }

  isTrader(){
    const isTrader = this.authService.getIsTrader();
    if(isTrader){
      return true;
    }
    return false;
  }
  
}

