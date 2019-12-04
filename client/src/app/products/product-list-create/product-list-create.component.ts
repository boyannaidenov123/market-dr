import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { MatRadioChange } from '@angular/material';


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
        validators:[]
      }),
      type:new FormControl(null, {
        validators:[Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      }),
      containers: new FormControl(null, {
        validators:[Validators.required]
      }),
      items: new FormControl(null, {
        validators: [Validators.required]
      }),
      height: new FormControl(null, {
        validators: [Validators.required]
      }),
      weight: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
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
  onSaveProduct():void{
    if(this.form.invalid){
      return;
    }else{
      this.productService.addNewProduct(this.form.value.name, this.form.value.type, this.form.value.containers, this.form.value.items, this.form.value.height, this.form.value.weight, this.form.value.price);

    }
    //this.form.reset(); not work!!!
  }

  radioChange(event: MatRadioChange) {
    this.selected = event.value;
    this.productService.getProducts(5, 1, this.selected);
}

}

export interface Flower {
  value: string;
}
