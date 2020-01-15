import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "./product.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  private products: Product[] = [];
  private productsUpdated = new Subject<{
    products: Product[];
    productCount: number;
  }>();
  private selected: number = 1;
  product: Product;
  private editProduct = new Subject<{ product: Product | any }>();

  constructor(private http: HttpClient) {}

  addNewProduct(
    name: string,
    type: string,
    containers: number,
    itemsInContainer: number,
    height: number,
    weight: number,
    blockPrice: number,
    auctionName: string,
    image: File
  ) {
    const product = new FormData();
    product.append("name", name);
    product.append("type", type);
    product.append("containers", "" + containers);
    product.append("itemsInContainer", "" + itemsInContainer);
    product.append("height", "" + height);
    product.append("weight", "" + weight);
    product.append("blockPrice", "" + blockPrice);
    product.append("auctionName", auctionName);
    product.append("image", image, name);
    this.http
      .post<{ message: string; flower: any }>(
        "http://localhost:9000/flowers/newFlower",
        product
      )
      .subscribe(response => {
        this.getProducts(5, 1);
      });
  }

  getProducts(productsPerPage: number, currentPage: number, selected?: number) {
    let queryParams;
    if (selected) {
      queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&selected=${selected}`;
      this.selected = selected;
    } else {
      queryParams = `?pagesize=${productsPerPage}&page=${currentPage}&selected=${this.selected}`;
    }
    this.http
      .get<{ message: string; products: any; maxProducts:any }>(
        "http://localhost:9000/flowers/" + queryParams
      )
      .pipe(
        map(productData => {
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
                blockPrice: product.blockPrice,
                auctionName: product.auctionName,
                imagePath: product.imagePath
              };
            }),
            maxProducts: productData.maxProducts
          };
        })
      )

      .subscribe(transformedProducts => {
        this.products = transformedProducts.products;
        this.productsUpdated.next({
          products: [...this.products],
          productCount: transformedProducts.maxProducts
        });
      });
  }

  updateProduct(
    id: string,
    name: string,
    type: string,
    containers: number,
    itemsInContainer: number,
    height: number,
    weight: number,
    blockPrice: number,
    auctionName: string,
    image: File | string
  ) {
    let product: Product | FormData;

    if (typeof image === "object") {
      product = new FormData();
      product.append("id", id);
      product.append("name", name);
      product.append("type", type);
      product.append("containers", "" + containers);
      product.append("itemsInContainer", "" + itemsInContainer);
      product.append("height", "" + height);
      product.append("weight", "" + weight);
      product.append("blockPrice", "" + blockPrice);
      product.append("auctionName", auctionName);
      product.append("image", image);
    } else {
      product = {
        id: id,
        name: name,
        type: type,
        containers: containers,
        itemsInContainer: itemsInContainer,
        height: height,
        weight: weight,
        blockPrice: blockPrice,
        auctionName: auctionName,
        imagePath: image
      };
    }

    this.http
      .put(`http://localhost:9000/flowers/${id}`, product)
      .subscribe(response => {
        this.getProducts(5, 1);
      });
  }

  getProductsUpdatedListener() {
    return this.productsUpdated.asObservable();
  }
  getOneProduct(editId: string) {
    this.http
      .get<{ product: Product }>(`http://localhost:9000/flowers/${editId}`)

      .subscribe(result => {
        this.editProduct.next({
          product: result.product
        });
      });
  }

  deleteProduct(deleteId: string) {
    return this.http.delete<{ message: string }>(
      `http://localhost:9000/flowers/${deleteId}`
    );
  }
  getEditProductListener() {
    return this.editProduct.asObservable();
  }
}
