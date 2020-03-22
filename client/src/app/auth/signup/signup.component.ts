import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isTrader = false;
  confirmationCode: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.confirmationCode = false;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.password != form.value.repeatPassword) {
      console.log("!=");
      return;
    }
    if (this.confirmationCode) {
      this.authService.getAccess(form.value.email, form.value.confirmationCode);
    } else {
      console.log(form.value.option);
      if(form.value.option == 2){
        this.isTrader = true;
      }
      this.authService.signup(form.value.email, form.value.password, this.isTrader);
      this.confirmationCode = true;
    }

  }

}
