import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(public http: HttpClient) { }

  addNewProduct(name:string, type:string, count:number, price:number, min:number){
    const product:Product = {
      name: name,
      type: type,
      count: count,
      price: price,
      min: min
    }
    this.http.post<{message:string, product:Product, id:string}>("http://localhost:9000/flowers/newFlower", product)
    .subscribe(response =>{
      console.log(response.message);
    })
  }

}
