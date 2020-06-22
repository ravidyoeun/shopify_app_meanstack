import { Component, Inject, Optional, OnInit } from '@angular/core';
import { Button } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { ShopifyService } from '../../http-services/shopify.service';
import { CookieService } from 'ngx-cookie-service';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Router, ActivatedRoute } from '@angular/router';
import { shopifyKeys } from '../../constants/shopify-keys';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit {
  title = 'shopapp';
  shop = '';
  hmac = '';
  code = '';
  state = '';
  name: string;
  stateCookie: string;
  private accessToken: string;
  apiSecret = shopifyKeys.SHOPIFY_API_SECRET;
  shopOrigin = '';
  private apiKey = '8ffc7f5e79cf6100614efa894acc7d13';
  private redirectUri = shopifyKeys.FORWARD_ADDRESS + '/auth/callback';
  Url = `/admin/oauth/authorize?client_id=${this.apiKey}&scope=read_products,read_content&redirect_uri=${this.redirectUri}`;
  authToken: any;
  constructor(
    private shopifyService: ShopifyService,
    private cookieService: CookieService,
    @Optional() @Inject(REQUEST) private request: any,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.code = queryParams.get('code');
      this.hmac = queryParams.get('hmac');
      this.shop = queryParams.get('shop');
      this.state = queryParams.get('state');
    });
    //get cookie
    this.stateCookie = this.cookieService.get('state');
    // this.stateCookie = localStorage.getItem('state');
    console.log('this.stateCookie', this.stateCookie);
    console.log('this.state from queryParams', this.state);
    if (this.stateCookie === undefined) {
      throw new Error('Request origin cannot be verified');
    }

    if (this.shop && this.hmac && this.code) {
      // DONE: Validate request is from Shopify
      var query = {
        code: this.code,
        hmac: this.hmac,
        shop: this.shop,
      };
      // let map = Object.assign({}, query);
      // delete map['signature'];
      // delete map['hmac'];
      // let message = JSON.stringify(map);
      // let providedHmac = Buffer.from(query.hmac, 'utf-8');
      // let generatedHash = Buffer.from(
      //   crypto
      //     .createHmac('sha256', this.apiSecret)
      //     .update(message)
      //     .digest('hex'),
      //   'utf-8'
      // );
      // let hashEquals = false;

      // try {
      //   hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      // } catch (e) {
      //   hashEquals = false;
      // }

      // if (!hashEquals) {
      //   throw new Error('HMAC validation failed');
      // }

      //res.status(200).send("HMAC validated");
      // TODO
      // Exchange temporary code for a permanent access token
      // Use access token to make API call to 'shop' endpoint
      let accessTokenRequestUrl =
        'https://' + this.shop + '/admin/oauth/access_token';
      let accessTokenPayload = {
        client_id: this.apiKey,
        client_secret: this.apiSecret,
        code: this.code,
      };

      this.shopifyService
        .postForToken(accessTokenRequestUrl, accessTokenPayload)
        .subscribe(
          (accessTokenResponse) => {
            console.log('accessTokenResponse', accessTokenResponse);
            this.accessToken = accessTokenResponse['access_token'];
            console.log(
              'this.accessToken',
              accessTokenResponse['access_token']
            );
            this.shopOrigin = this.shop;
            console.log('shopOrigin', this.shopOrigin);
            var permissionUrl = 'https://' + this.shopOrigin + this.Url;
            console.log('permissionUrl', permissionUrl);
            // If the current window is the 'parent', change the URL by setting location.href
            if (window.top == window.self) {
              window.location.assign(permissionUrl);

              // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
            } else {
              const app = createApp({
                apiKey: this.apiKey,
                shopOrigin: this.shopOrigin,
              });

              Redirect.create(app).dispatch(
                Redirect.Action.REMOTE,
                permissionUrl
              );
            }
          },
          (err) => {
            console.log('err', err);
          }
        );
    }
  }
}
