import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Credential} from '../shared/model/credential.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginURL = '';
  constructor(private httpClient: HttpClient) {
    this.loginURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAR4Yezxk7Ao4qeFntu7tIvE7pH28Eh64Y';
  }
  login(creds: Credential) {
    return this.httpClient.post(this.loginURL, creds);
  }
}
