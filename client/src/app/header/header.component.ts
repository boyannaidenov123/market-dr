import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private isAdmin = false;
  private AdminSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.AdminSubs = this.authService
      .getIsAdminListener()
      .subscribe((response) => {
        this.isAdmin = response;
      });
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
