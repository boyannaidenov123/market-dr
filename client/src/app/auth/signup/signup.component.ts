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
  

  constructor(public authService: AuthService) { }

  ngOnInit() {
    
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.password != form.value.repeatPassword) {
      console.log("!=");
      return;
    }
      console.log(form.value.option);
      if(form.value.option == 2){
        this.isTrader = true;
      }
      this.authService.signup(form.value.email, form.value.password, this.isTrader);
    }
  }