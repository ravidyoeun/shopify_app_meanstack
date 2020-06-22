import { Component, Inject, Optional } from '@angular/core';
import { Button } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { ShopifyService } from './http-services/shopify.service';
import { CookieService } from 'angular2-cookie/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Router, ActivatedRoute } from '@angular/router';
import { shopifyKeys } from './constants/shopify-keys';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'shopapp';
  shop = '';
  hmac = '';
  code = '';
  state = '';
  name: string;
  private accessToken: string;
  shopOrigin = '';
  private apiKey = '8ffc7f5e79cf6100614efa894acc7d13';
  private redirectUri = shopifyKeys.FORWARD_ADDRESS + '/auth/callback';
  Url = `/admin/oauth/authorize?client_id=${this.apiKey}&scope=read_products,read_content&redirect_uri=${this.redirectUri}`;
  constructor(
    private shopifyService: ShopifyService,
    private cookieService: CookieService,
    @Optional() @Inject(REQUEST) private request: any,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.code = queryParams.get('code');
      this.hmac = queryParams.get('hmac');
      this.shop = queryParams.get('shop');
      this.state = queryParams.get('state');
    });

    console.log('get cookie', this.request);
    this.state = this.cookieService.get('state');
    console.log('getting state from cookie:', this.state);
    // this.shopifyService.getToken().subscribe(
    //   (success) => {
    //     console.log('getting token from shopify', success['authObj']);
    //     this.accessToken = success['authObj'].authToken;
    //     console.log('accessToken', this.accessToken);
    //     this.shopOrigin = success['authObj'].shop;
    //     console.log('shopOrigin', this.shopOrigin);

    //     var permissionUrl = 'https://' + this.shopOrigin + this.Url;
    //     console.log('permissionUrl', permissionUrl);
    //     // If the current window is the 'parent', change the URL by setting location.href
    //     if (window.top == window.self) {
    //       window.location.assign(permissionUrl);

    //       // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    //     } else {
    //       const app = createApp({
    //         apiKey: this.apiKey,
    //         shopOrigin: this.shopOrigin,
    //       });

    //       Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}

// const app = createApp({
//   apiKey: 'API key from Shopify Partner Dashboard',
//   shopOrigin: '',
// });

//ng serve --host 0.0.0.0 --disable-host-check
