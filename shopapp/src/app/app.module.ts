import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ShopifyService } from './http-services/shopify.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CallbackComponent } from './shopify-page/callback/callback.component';
import { InitialloadComponent } from './shopify-page/initialload/initialload.component';

@NgModule({
  declarations: [AppComponent, CallbackComponent, InitialloadComponent],
  imports: [BrowserModule, AppRoutingModule, CommonModule, HttpClientModule],
  providers: [ShopifyService, CookieService, Document],
  bootstrap: [AppComponent],
  exports: [AppComponent, CallbackComponent, InitialloadComponent],
})
export class AppModule {}
