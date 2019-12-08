import {Component, OnInit } from '@angular/core';
import { PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


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

  userIsAuthenticated = false;
  userId:string;
  private productsSub:Subscription;
  private editProductSub: Subscription;



  displayedColumns: string[] = ['name', 'type', 'containers', 'items', 'height', 'weight', 'price', 'EDIT', 'DELETE'];
  dataSource = new MatTableDataSource<Product>(this.products);  

  constructor(private productsService: ProductsService, private authService: AuthService){}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

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

  onDelete(id:string){
    this.productsService.deleteProduct(id)
    .subscribe(()=>{
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    })
  }

  onEdit(id:string){
    this.productsService.getOneProduct(id);
  }

  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }


}