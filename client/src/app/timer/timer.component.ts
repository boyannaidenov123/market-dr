import { Component, OnInit, Input } from "@angular/core";
import { MarketService } from "../markets/market.service";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent implements OnInit {
  private time: number = 0;
  private days: number = 0;
  @Input() auction;

  constructor(private marketService: MarketService) {}

  ngOnInit() {
    this.marketService.getInfoForAuction(this.auction).subscribe((response) => {
      const dateNow = new Date();
      this.time =
        (new Date(response.startTime).getTime() - dateNow.getTime()) / 1000;
      this.days = Math.floor(this.time / 86400);
    });
  }
}
