import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-larger-image',
  templateUrl: './LargerImage.html'
})
export class LargerImage {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any) { }
}
