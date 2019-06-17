import { Component, OnInit, NgZone } from '@angular/core';
import { AccountService } from 'src/app/providers/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isRegisterModalShown = false;
  isLoginModalShown = false;
  credentials: any = {};
  isLoggedIn;
  errorString: string;

  constructor(private Account: AccountService, private _zone: NgZone) {
    // this.Account._auth.signOut();
    this.Account._auth.onAuthStateChanged((user) => {
      this._zone.run(() => {
        if (user) {
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
          }
      });
    });
  }

  ngOnInit() {
  }

  showLoginModal(): void {
    this.isLoginModalShown = true;
  }

  showRegisterModal(): void {
    this.isRegisterModalShown = true;
  }

  hideModals(): void {
    this.isRegisterModalShown = false;
    this.isLoginModalShown = false;
    this.credentials = {};
  }

  async login(): Promise<void> {
    console.log('trying to login');
    const result = await this.Account.login(this.credentials.email, this.credentials.password);
    if (result) {
      this.isLoginModalShown = false;
      this.credentials = {};
    }
  }

  async register(): Promise<void> {
    console.log('trying to register');
    const result = await this.Account.register(this.credentials.name, this.credentials.email, this.credentials.password);
    if (result) {
      this.isRegisterModalShown = false;
      this.credentials = {};
    }
  }

  logout(): void {
    console.log('logging out');
    this.Account.logout();
  }

  validateForm(): void {

    if (this.isRegisterModalShown) {
      if (this.credentials.name == null || this.credentials.name.trim() === '') {
        this.errorString = 'Name cannot be empty.';
      }

      if (this.credentials.password !== this.credentials.confirmPassword) {
        this.errorString = 'Passwords dont match.';
      }
    }

    if (this.credentials.password == null || this.credentials.password.length < 6) {
      this.errorString = 'Password should be atleast 6 charactors long.';
    }

    // tslint:disable-next-line:max-line-length
    const testString = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!testString.test(String(this.credentials.email).toLowerCase())) {
      this.errorString = 'Please provide a valid email';
    }

    if (this.credentials.email == null) {
      this.errorString = 'Email should not be empty';
    }

    console.log('validations passed');
    
    
    if (this.errorString != null) {
      setTimeout(() => {
        this.errorString = null;
      }, 5000);
    } else {
      if (this.isLoginModalShown) {
        this.login();
      } else {
        this.register();
      }
    }
  }

}
