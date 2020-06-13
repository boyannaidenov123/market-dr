import { Component, OnInit } from "@angular/core";
import { MarketService } from "../market.service";

@Component({
  selector: "app-varna",
  templateUrl: "./varna.component.html",
  styleUrls: ["./varna.component.css"],
})
export class VarnaComponent implements OnInit {
  private activate = false;
  auction: string = "Varna";

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
