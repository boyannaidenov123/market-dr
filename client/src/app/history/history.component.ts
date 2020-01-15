import { Component, OnInit } from '@angular/core';
import { HistoryService } from './history.service';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { LargerImage } from '../products/product-list/LargerImage';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  
  private history:any;
  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  private loading= false;

  private productsSub:Subscription;

  displayedColumns: string[] = ['name', 'type', 'containers', 'items', 'height', 'weight', 'price', 'auctionName', 'date', 'seller', 'imagePath'];
  dataSource = new MatTableDataSource<any>(this.history);  
  
  constructor(private historyService: HistoryService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loading = false;
    this.historyService.getBuyerHistory();
    this.productsSub = this.historyService.getFlowersUpdatedListener()
    .subscribe((flowerData:{flowers:any, flowersCount: number})=>{
      this.loading = true;
      this.history = flowerData.flowers;
      this.dataSource = new MatTableDataSource<any>(this.history);
    })

  }

  openImage(imagePath:string){
    this.dialog.open(LargerImage, {
      data: {
        imagePath: imagePath
      }
    });
  }


}
