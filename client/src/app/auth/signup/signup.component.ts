import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isTrader:boolean;
  name:string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isTrader = false;
    this.name = "User:";
  }

  onSignup(form:NgForm){
    if(form.invalid){
      return;
    }
    if(form.value.password != form.value.repeatPassword){
      console.log("!=");
      return;
    }
    this.authService.signup(form.value.email, form.value.password, this.isTrader);
  }
  changeStatut(){
    this.isTrader = !this.isTrader;
    if(this.isTrader){this.name = "Trader:";}
    else{this.name = "User:";}

  }

}
