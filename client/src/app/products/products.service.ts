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

  constructor(public http: HttpClient) { }

  addNewProduct(name:string, type:string, count:number, price:number, min:number){
    const product:Product = {
      name: name,
      type: type,
      count: count,
      price: price,
      min: min
    }
    this.http.post<{message:string, flower:any}>("http://localhost:9000/flowers/newFlower", product)
    .subscribe(response =>{
      console.log(response.flower);
      this.getProducts(5, 1);
    })
  }

  getProducts(productsPerPage: number, currentPage:number){
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{message:string; products:any, maxProducts}>("http://localhost:9000/flowers/" + queryParams)
    .pipe(
      map((productData) => {
          return {
            products: productData.products.map(product => {
                  return {
                      name: product.name,
                      type: product.type,
                      id: product._id,
                      count: product.count,
                      price: product.price,
                      min: product.min
                  };
              }), maxProducts: productData.maxProducts
          };
      })
  )

    .subscribe(transformedProducts =>{
      console.log(transformedProducts)
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
