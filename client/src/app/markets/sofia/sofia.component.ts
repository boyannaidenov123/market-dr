import { Component, OnInit } from "@angular/core";
import { MarketService } from "../market.service";

@Component({
  selector: "app-sofia",
  templateUrl: "./sofia.component.html",
  styleUrls: ["./sofia.component.css"],
})
export class SofiaComponent implements OnInit {
  private activate = false;
  auction: string = "Sofia";

  constructor(private marketService: MarketService) {}

  ngOnInit() {
    this.marketService.getInfoForAuction(this.auction).subscribe((response) => {
      this.activate = response.activate;
      if (!response.activate) {
        setTimeout(() => {
          this.activate = true;
        }, new Date(response.startTime).getTime() - Date.now());
      }
    });
  }
}
