import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ProfileService } from "./profile.service";
import { User } from "../auth/user.model";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: User = {
    email: "",
    name: "",
    isTrader: false,
  };
  loadHistoryComponent: boolean = false;

  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.profileService.getUserInfo().subscribe((user) => {
      this.user.name = user.name;
      this.user.email = user.email;
      this.user.isTrader = user.isTrader;
      this.loadHistoryComponent = true;
    });
  }

  changeName(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.profileService.changeName(form.value.name).subscribe((result) => {
      this.user.name = result.name;
      form.reset();
      this.snackBar.open(result.message, "Close", { duration: 3000 });
    });
  }

  changePassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.profileService
      .changePassword(form.value.password, form.value.newPassword)
      .subscribe((result) => {
        this.snackBar.open(result.message, "Close", { duration: 3000 });
      });
  }
  changePayPalAccount(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.profileService
      .setPayPalAccount(form.value.clientID, form.value.secret)
      .subscribe((result) => {
        this.snackBar.open(result.message, "Close", { duration: 3000 });
      });
  }
}
