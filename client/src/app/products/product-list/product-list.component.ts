import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  products: Product[] = [];

  private productsSub:Subscription;



  displayedColumns: string[] = ['name', 'type', 'count', 'price', 'min'];
  dataSource = new MatTableDataSource<Product>(this.products);  

  constructor(private productsService: ProductsService){}

  ngOnInit() {
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.productsSub = this.productsService.getProductsUpdatedListener()
    .subscribe((productsData:{products:Product[], productCount: number})=>{
      this.totalProducts = productsData.productCount;
      this.products = productsData.products;
      this.dataSource = new MatTableDataSource<Product>(this.products);  
    })

  }
  onChangePage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }


}