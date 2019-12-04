import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<{products:Product[], productCount: number}>();
  private selected:number = 1;

  constructor(private http: HttpClient) { }

  addNewProduct(name:string, type:string, containers:number, price:number, itemsInContainer:number, height:number, weight:number){
    const product:Product = {
      name: name,
      type: type,
      containers: containers,
      itemsInContainer: itemsInContainer,
      height: height,
      weight: weight,
      price: price
    }
    this.http.post<{message:string, flower:any}>("http://localhost:9000/flowers/newFlower", product)
    .subscribe(response =>{
      console.log(response.flower);
      this.getProducts(5, 1);
    })
  }

  getProducts(productsPerPage: number, currentPage:number, selected?:number){
    let queryParams;
    if(selected){
      queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&selected=${selected}`;
      this.selected = selected;
    }else{
      queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&selected=${this.selected}`;
    }
    this.http.get<{message:string; products:any, maxProducts}>("http://localhost:9000/flowers/" + queryParams)
    .pipe(
      map((productData) => {
          return {
            products: productData.products.map(product => {
                  return {
                      seller: product.seller,
                      name: product.name,
                      type: product.type,
                      id: product._id,
                      containers: product.containers,
                      itemsInContainer: product.itemsInContainer,
                      height: product.height,
                      weight: product.weight,
                      price: product.price
                  };
              }), maxProducts: productData.maxProducts
          };
      })
  )

    .subscribe(transformedProducts =>{
      this.products = transformedProducts.products;
      this.productsUpdated.next({
        products: [...this.products],
        productCount: transformedProducts.maxProducts
      })
    })

  }
  getProductsUpdatedListener(){
    return this.productsUpdated.asObservable();
  }

}
