import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { error } from 'util';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isAuthenticated: boolean;
  userWriteCode: boolean;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = true;
    this.userWriteCode = false;
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.userWriteCode) {
      this.authService.getAccess(form.value.email, form.value.confirmationCode)
      .subscribe(response => {
        if (response.signup) {
          this.authService.login(form.value.email, form.value.password);
        }
      });
    }
    else {
      this.authService.isProfileAuthenticated(form.value.email, form.value.password).subscribe((res) => {
        if (res.isPofileAuth) {
          this.authService.login(form.value.email, form.value.password);
        } else {
          this.isAuthenticated = false;
          this.userWriteCode = true;
        }
      }, error =>{
        this.userWriteCode = false;
      })
    }
  }
}
