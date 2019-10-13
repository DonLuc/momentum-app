import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class BankingService {

  baseURL = '';
  constructor(private httpClient: HttpClient) {
    this.baseURL = 'https://momentum-retail-practical-test.firebaseio.com';
  }

  clientDetails(localId: string, token: string) {
    return this.httpClient.get(`${this.baseURL}/clients/${localId}.json?auth=${token}`);
  }

  getAccount(account, token) {
    return this.httpClient.get(`${this.baseURL}/accounts/${account}.json?auth=${token}`);
  }

  updateAccount(account, token, body) {
    return this.httpClient.put(`${this.baseURL}/accounts/${account}.json?auth=${token}`, body);
  }

  updateAccountList(localId, token, body) {
    return this.httpClient.put(`${this.baseURL}/clients/${localId}/accounts.json?auth=${token}`, body);
  }

}
