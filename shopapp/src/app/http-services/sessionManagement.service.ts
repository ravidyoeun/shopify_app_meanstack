import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class SessionManagementService {
  constructor(private cookieService: CookieService, private router: Router) {}

  setUserSession(key: string, data: any, expireTime: Date) {
    this.cookieService.set('cookie-name', 'our cookie value');
  }

  getUserSessionInfo(key: string) {
    if (this.cookieService.get(key) == 'undefined') {
      return null;
    } else {
      if (!this.cookieService.get(key)) {
        return null;
      } else {
        return JSON.parse(this.cookieService.get(key));
      }
    }
  }

  destroyUserSession() {
    // this.cookieService.removeAll();
  }

  authenticate() {
    if (
      !this.getUserSessionInfo('userInfo') ||
      this.getUserSessionInfo('userInfo') == 'undefined' ||
      this.getUserSessionInfo('userInfo') == null
    ) {
      // this.router.navigate(['/pages/login'])
      return false;
    } else {
      return true;
    }
  }
}
