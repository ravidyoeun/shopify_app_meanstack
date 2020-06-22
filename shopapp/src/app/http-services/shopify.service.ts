import { Injectable } from '@angular/core';
import { api } from '../constants/api-end-points';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ShopifyService {
  private apiUrl: string = api.apiUrl;

  constructor(private http: HttpClient) {}

  public getToken() {
    console.log('getting token from', this.apiUrl);
    return this.http.get(this.apiUrl + 'api/auth');
  }

  public postForToken(url: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Header':
        'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE, OPTIONS, PATCH',
    });
    let options = { headers: headers };
    var corsUrl = 'https://cors-anywhere.herokuapp.com/' + url;
    return this.http.post(corsUrl, data, options);
  }
}
