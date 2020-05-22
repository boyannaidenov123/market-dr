import { Component, OnInit, Input } from "@angular/core";
import { SocketService } from "../markets/socket.service";
import { Product } from "../products/product.model";
import { MatTableDataSource } from "@angular/material";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-clock",
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.css"]
})
export class ClockComponent implements OnInit {
  progress;
  progressBar = document.querySelector(".progress-bar");
  private lotId: string;
  private userId: string;
  private containers: number = 1;
  private product: Product;
  private imagePath: string = "";
  @Input() auction;

  private countUsers;

  displayedColumns: string[] = [
    "name",
    "type",
    "containers",
    "items",
    "height",
    "weight",
    "price",
    "minPrice",
    "blockPrice",
    "auctionName",
    "additionalInformation"
  ];
  dataSource = new MatTableDataSource<Product>([]);
  private isTrader_: boolean = false;
  private isTraderSub: Subscription;

  constructor(
    private SocketService: SocketService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(Date());
    //Connect socket
    this.SocketService.listen("connection" + this.auction).subscribe(
      (res: any) => {
        console.log(res);
      }
    );

    //Get clock value
    /*this.SocketService.listen("clockValue" + this.auction).subscribe(
      (res: any) => {
        this.progress = res.value;
        this.product.price = res.value * this.product.blockPrice;
        this.dataSource = new MatTableDataSource<Product>([this.product]);
      }
    );*/

    //Get which Lot is for sale
    this.SocketService.listen("lotForSale" + this.auction).subscribe(
      (res: any) => {
        console.log(res);
        this.progress = res.currentPrice;
        this.lotId = res._id;
        this.imagePath = res.imagePath;
        this.product = {
          name: res.name,
          type: res.type,
          containers: res.containers,
          itemsInContainer: res.itemsInContainer,
          height: res.height,
          weight: res.weight,
          minPrice: 10 * res.blockPrice,
          blockPrice: res.blockPrice,
          auctionName: res.auctionName,
          additionalInformation: res.additionalInformation,
          price: (res.currentPrice * res.blockPrice)/100
        };
        this.dataSource = new MatTableDataSource<Product>([this.product]);
        //trqbva da ocvetq dadeniq Flower v tablicata
      }
    );

    this.SocketService.listen("countUsers").subscribe((res: any) => {
      this.countUsers = res.countUsers;
      console.log(this.countUsers);
    });

    this.SocketService.listen("bought" + this.auction).subscribe(() => {
      this.snackBar.open("Bought !", "Close", { duration: 2000 });
    });

    this.SocketService.listen("end" + this.auction).subscribe(() => {
      this.snackBar.open(`End ${this.auction}! Refresh page `, "Close", { duration: 3000 });
    });

    this.authService.getIsTrader();
    this.isTraderSub = this.authService
      .getIsTraderListener()
      .subscribe(isTrader => {
        this.isTrader_ = isTrader;
      });
  }

  isTrader() {
    return !this.isTrader_;
  }

  onBuyLot() {
    if (this.isTrader_) {
      return;
    }
    this.userId = localStorage.getItem("userId");
    if (!this.containers || this.containers <= 0) {
      this.containers = 1;
    }
    console.log(this.containers);
    //Buy lot
    this.SocketService.sent("buyLot" + this.auction, {
      userId: this.userId,
      containers: this.containers
    });
  }

  ngOnDestroy() {
    this.isTraderSub.unsubscribe();
  }
}
