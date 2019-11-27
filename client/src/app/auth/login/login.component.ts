import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isTrader:boolean;
  name:string;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isTrader = false;
    this.name = "User:";
  }

  onLogin(form:NgForm){
    if(form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password, this.isTrader);
  }
  changeStatut(){
    this.isTrader = !this.isTrader;
    if(this.isTrader){this.name = "Trader:";}
    else{this.name = "User:";}

  }

}
