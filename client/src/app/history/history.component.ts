import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { HistoryService } from "./history.service";
import { MatTableDataSource, PageEvent } from "@angular/material";
import { Subscription } from "rxjs/internal/Subscription";
import { MatDialog } from "@angular/material/dialog";
import { LargerImage } from "../products/product-list/LargerImage";
import * as $ from "jquery";
declare var paypal;
var historyID: string;
function asdf(){
  
}

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class HistoryComponent implements OnInit {
  @ViewChild("paypal", { static: true }) paypalElement: ElementRef;

  private history: any;
  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  private loading = false;
  haveHistory = false;
  @Input() isTrader = false;

  private productsSub: Subscription;

  displayedColumns: string[] = [
    "name",
    "type",
    "containers",
    "items",
    "height",
    "weight",
    "price",
    "auctionName",
    "date",
    "seller",
    "buyer",
    "imagePath",
    "transaction"
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private historyService: HistoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = false;
    setTimeout(() => {
      console.log(this.isTrader);
      this.historyService.getBuyerHistory(5, 1, this.isTrader);

      this.productsSub = this.historyService
        .getFlowersUpdatedListener()
        .subscribe((flowerData: { flowers: any; flowersCount: number }) => {
          this.loading = true;
          console.log(flowerData);
          if (flowerData.flowersCount == 0) {
            this.haveHistory = false;
          } else {
            this.haveHistory = true;
            this.totalProducts = flowerData.flowersCount;
            console.log(this.totalProducts);
            this.history = flowerData.flowers;
            this.dataSource = new MatTableDataSource<any>(this.history);

            $.getScript(
              "https://www.paypalobjects.com/api/checkout.js",
              function() {
                paypal.Button.render(
                  {
                    env: "sandbox",
                    payment: function(data, actions) {
                      // 2. Make a request to your server
                      return actions.request
                        .post("http://localhost:9000/history/createPayment", {
                          jwt: `Bearer ${localStorage.getItem("token")}`,
                          historyId: historyID
                        })
                        .then(function(res) {
                          // 3. Return res.id from the response
                          console.log(res);
                          return res.id;
                        });
                    },
                    // Execute the payment:
                    // 1. Add an onAuthorize callback
                    onAuthorize: function(data, actions) {
                      // 2. Make a request to your server
                      console.log(data);
                      return actions.request
                        .post("http://localhost:9000/history/executePayment", {
                          paymentID: data.paymentID,
                          payerID: data.payerID,
                          jwt: `Bearer ${localStorage.getItem("token")}`,
                          historyId: historyID
                        })
                        .then(function(res) {
                          // 3. Show the buyer a confirmation message.
                          
                        });
                    }
                  },
                  "#paypal-button"
                );
              }
            );
          }
        });
    }, 500);
  }

  openImage(imagePath: string) {
    this.dialog.open(LargerImage, {
      data: {
        imagePath: imagePath
      }
    });
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.historyService.getBuyerHistory(
      this.productsPerPage,
      this.currentPage,
      this.isTrader
    );
  }
  setHistoyID(id: string) {
    historyID = id;
  }
  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }
}
