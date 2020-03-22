import { Component, OnInit, Input } from "@angular/core";
import { HistoryService } from "./history.service";
import { MatTableDataSource, PageEvent } from "@angular/material";
import { Subscription } from "rxjs/internal/Subscription";
import { MatDialog } from "@angular/material/dialog";
import { LargerImage } from "../products/product-list/LargerImage";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class HistoryComponent implements OnInit {
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
  dataSource = new MatTableDataSource<any>(this.history);

  constructor(
    private historyService: HistoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = false;
    setTimeout(() => {
      console.log(this.isTrader)
      this.historyService.getBuyerHistory(5, 1, this.isTrader);
    }, 1000)
    
    this.productsSub = this.historyService
      .getFlowersUpdatedListener()
      .subscribe((flowerData: { flowers: any; flowersCount: number }) => {
        this.loading = true;
        console.log(flowerData)
        if (flowerData.flowersCount == 0) {
          this.haveHistory = false;
        } else {
          this.haveHistory = true;
          this.totalProducts = flowerData.flowersCount;
          console.log(this.totalProducts);
          this.history = flowerData.flowers;
          this.dataSource = new MatTableDataSource<any>(this.history);
        }
      });
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
    this.historyService.getBuyerHistory(this.productsPerPage, this.currentPage, this.isTrader);
  }
}
