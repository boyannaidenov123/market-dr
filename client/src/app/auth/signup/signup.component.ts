import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isTrader: boolean;
  name: string;
  confirmationCode: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isTrader = false;
    this.name = "User:";
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
      this.authService.signup(form.value.email, form.value.password, this.isTrader);
      this.confirmationCode = true;
    }

  }
  changeStatut() {
    this.isTrader = !this.isTrader;
    if (this.isTrader) { this.name = "Trader:"; }
    else { this.name = "User:"; }

  }

}
