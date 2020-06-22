import { Component, Inject, Optional, OnInit } from '@angular/core';
import { Button } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { ShopifyService } from '../../http-services/shopify.service';
import { DOCUMENT } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Router, ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { CookieService } from 'ngx-cookie-service';
import { shopifyKeys } from '../../constants/shopify-keys';
import { domain } from 'process';
@Component({
  selector: 'app-initialload',
  templateUrl: './initialload.component.html',
  styleUrls: ['./initialload.component.css'],
})
export class InitialloadComponent implements OnInit {
  title = 'shopapp';
  shop = '';
  hmac = '';
  code = '';
  state = '';
  private forwardingAddress = shopifyKeys.FORWARD_ADDRESS; // Replace this with your HTTPS Forwarding address
  private hostDomain = shopifyKeys.HOSTDOMAIN;
  apiKey = shopifyKeys.SHOPIFY_API_KEY;
  scopes = 'read_products';
  name: string;
  private accessToken: string;
  shopOrigin = '';
  constructor(
    private shopifyService: ShopifyService,
    private cookieService: CookieService,
    @Optional() @Inject(REQUEST) private request: any,
    private router: Router,
    private route: ActivatedRoute,
    private document: Document
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.code = queryParams.get('code');
      this.hmac = queryParams.get('hmac');
      this.shop = queryParams.get('shop');
      this.state = queryParams.get('state');
    });

    if (this.shop) {
      const state = Date.now();
      const redirectUri = this.forwardingAddress + '/auth/callback';
      const installUrl =
        'https://' +
        this.shop +
        '/admin/oauth/authorize?client_id=' +
        this.apiKey +
        '&scope=' +
        this.scopes +
        '&state=' +
        state +
        '&redirect_uri=' +
        redirectUri;
      let stateJson = JSON.stringify(state);

      console.log('this.state', stateJson);

      this.cookieService.set(
        'state',
        stateJson,
        9000,
        null,
        '.myshopify.com',
        false,
        'None'
      );

      this.cookieService.set(
        'state',
        stateJson,
        9000,
        null,
        this.hostDomain,
        false,
        'None'
      );

      console.log('redirecting', installUrl);
      window.location.href = installUrl;
    }
  }
}
