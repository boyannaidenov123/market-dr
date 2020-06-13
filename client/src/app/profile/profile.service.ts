import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get<{ email: string; name: string; isTrader: boolean }>(
      "http://localhost:9000/profile/info"
    );
  }
  changeName(name: string) {
    return this.http.put<{ message: string; name: string }>(
      "http://localhost:9000/profile/changeName",
      { name: name }
    );
  }
  changePassword(password: string, newPassword: string) {
    const passwords = {
      password: password,
      newPassword: newPassword,
    };
    return this.http.put<{ message: string }>(
      "http://localhost:9000/profile/changePassword",
      passwords
    );
  }
  setPayPalAccount(clientID: string, secret: string) {
    const account = {
      clientID: clientID,
      secret: secret,
    };
    return this.http.put<{ message: string }>(
      "http://localhost:9000/profile/paypalAccount",
      account
    );
  }
}
