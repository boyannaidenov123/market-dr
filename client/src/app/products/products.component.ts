import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  private isTrader_: boolean = false;
  private isTraderSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getIsTrader();
    this.isTraderSub = this.authService
      .getIsTraderListener()
      .subscribe((isTrader) => {
        this.isTrader_ = isTrader;
      });
  }

  isTrader() {
    return this.isTrader_;
  }
  ngOnDestroy(): void {
    this.isTraderSub.unsubscribe();
  }
}
