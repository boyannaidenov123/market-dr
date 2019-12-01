import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-list-create',
  templateUrl: './product-list-create.component.html',
  styleUrls: ['./product-list-create.component.css']
})
export class ProductListCreateComponent implements OnInit {
  selected;
  form:FormGroup;

  constructor(private productService: ProductsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators:[Validators.required]
      }),
      type:new FormControl(null, {
        validators:[Validators.required, Validators.minLength(3)]
      }),
      count: new FormControl(null, {
        validators:[Validators.required]
      }),
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      min: new FormControl(null, {
        validators: [Validators.required]
      })
    })
  }


  flowers: Flower[] = [
    {value: 'Acacia'},
    {value: 'Acanthus'},
    {value: 'Aloe'},
    {value: 'Amaranth'},
    {value: 'American ash'},
    {value: 'Angelica'},
    {value: 'Anthericum'},
    {value: 'Arum'},
    {value: 'Arum, Fly-catching'},
    {value: 'Ash-leaved Trumpet-flower'},
    {value: 'Aspen'},
    {value: 'Aster, China'}


  ];
  onSaveProduct(){
    if(this.form.invalid){
      return;
    }else{
      this.productService.addNewProduct(this.form.value.name, this.form.value.type, this.form.value.count, this.form.value.price, this.form.value.min);

    }
    this.form.reset();
  }

}

export interface Flower {
  value: string;
}
