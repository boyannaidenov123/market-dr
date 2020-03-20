import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { ProductsService } from "../products.service";
import { MatRadioChange } from "@angular/material";
import { Subscription } from "rxjs";
import { mimeType } from './mime-type.validator';

@Component({
  selector: "app-product-list-create",
  templateUrl: "./product-list-create.component.html",
  styleUrls: ["./product-list-create.component.css"]
})
export class ProductListCreateComponent implements OnInit {
  selected;
  form: FormGroup;

  private id: string;
  private editProductSub: Subscription;
  private mode: string = "create";

  imagePreview: string;

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.editProductSub = this.productService
      .getEditProductListener()
      .subscribe(result => {
        this.mode = "edit";
        this.id = result.product._id;
        this.form.controls["name"].setValue(result.product.name);
        this.form.controls["type"].setValue(result.product.type);
        this.form.controls["containers"].setValue(result.product.containers);
        this.form.controls["items"].setValue(result.product.itemsInContainer);
        this.form.controls["height"].setValue(result.product.height);
        this.form.controls["weight"].setValue(result.product.weight);
        this.form.controls["blockPrice"].setValue(result.product.blockPrice);
        this.form.controls["auctionName"].setValue(result.product.auctionName);
        this.form.controls["image"].setValue(result.product.imagePath);
        this.form.controls["additionalInformation"].setValue(result.product.additionalInformation);
        this.imagePreview = result.product.imagePath;
      });

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: []
      }),
      type: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15)
        ]
      }),
      containers: new FormControl(null, {
        validators: [Validators.required]
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
      blockPrice: new FormControl(null, {
        validators: [Validators.required]
      }),
      auctionName: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      additionalInformation: new FormControl(null, {})
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  flowers: Flower[] = [
    { value: "Acacia" },
    { value: "Acanthus" },
    { value: "Aloe" },
    { value: "Amaranth" },
    { value: "American ash" },
    { value: "Angelica" },
    { value: "Anthericum" },
    { value: "Arum" },
    { value: "Arum, Fly-catching" },
    { value: "Ash-leaved Trumpet-flower" },
    { value: "Aspen" },
    { value: "Aster, China" }
  ];
  auctionNames: Name[] = [
    { value: "Sofia" },
    { value: "Varna" },
    { value: "Plovdiv" }
  ];

  onSaveProduct(): void {
    if (this.form.invalid) {
      return;
    } else {
      if (this.mode === "create") {
        this.productService.addNewProduct(
          this.form.value.name,
          this.form.value.type,
          this.form.value.containers,
          this.form.value.items,
          this.form.value.height,
          this.form.value.weight,
          this.form.value.blockPrice,
          this.form.value.auctionName,
          this.form.value.image,
          this.form.value.additionalInformation
        );
      } else {
        this.productService.updateProduct(
          this.id,
          this.form.value.name,
          this.form.value.type,
          this.form.value.containers,
          this.form.value.items,
          this.form.value.height,
          this.form.value.weight,
          this.form.value.blockPrice,
          this.form.value.auctionName,
          this.form.value.image,
          this.form.value.additionalInformation
        );
        this.mode = "create";
      }
    }
    //this.form.reset() //not work!!!
    this.form.reset();
  }

  radioChange(event: MatRadioChange) {
    this.selected = event.value;
    this.productService.getProducts(5, 1, this.selected);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.editProductSub.unsubscribe();
  }
}

export interface Flower {
  value: string;
}

export interface Name {
  value: string;
}
