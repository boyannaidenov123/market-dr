import {Component, OnInit } from '@angular/core';
import { PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {TooltipPosition} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import { LargerImage } from './LargerImage';


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
  private loading= false;
  private position: TooltipPosition = "above";

  isTrader_:boolean = false;
  isAdmin: boolean = false;
  userIsAuthenticated = false;
  userId:string;
  private productsSub:Subscription;
  private isTraderSub: Subscription;
  private isAdminSub: Subscription;




  displayedColumns: string[] = ['name', 'type', 'containers', 'items', 'height', 'weight', 'blockPrice', 'auctionName', 'image', 'additionalInformation'];
  dataSource = new MatTableDataSource<Product>(this.products);  

  constructor(private productsService: ProductsService, private authService: AuthService, public dialog: MatDialog){}

  ngOnInit() {
    console.log(this.getLenght("1234567890"))
    this.isTraderSub = this.authService.getIsTraderListener()
      .subscribe(isTrader => {
        if (isTrader) {
          this.displayedColumns.push('EDIT');
          this.displayedColumns.push('DELETE');
          this.isTrader_ = true;
        }
      })

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.productsSub = this.productsService.getProductsUpdatedListener()
    .subscribe((productsData:{products:Product[], productCount: number})=>{
      this.loading = true;
      this.totalProducts = productsData.productCount;
      this.products = productsData.products;
      this.dataSource = new MatTableDataSource<Product>(this.products);  
    })

    this.authService.getIsAdmin()
    .subscribe(result =>{
      this.isAdmin = result.isAdmin;
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

  isTrader(){
    return this.authService.getIsTrader();
  }
  openImage(imagePath:string){
    this.dialog.open(LargerImage, {
      data: {
        imagePath: imagePath
      }
    });
  }
  getLenght(text: string){
    if(text){
      if(text.length > 8){
        return text.substring(0,5) + "...";
      }
      return text;
    }

  }

  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
    this.isTraderSub.unsubscribe()
  }



}

