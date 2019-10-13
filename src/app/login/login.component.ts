import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Credential } from '../shared/model/credential.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLogin: Credential = {
    email: '',
    password: '',
    returnSecureToken: true
  };
  loginForm: FormGroup;
  constructor(private router: Router, private loginService: LoginService) {
    this.createLoginForm();
  }

  ngOnInit() { }

  createLoginForm() {
    return (this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      validatePassword: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    }));
  }

  login() {
    if (this.extractCredential() !== undefined) {
      this.loginService.login(this.extractCredential()).subscribe((response: any) => {
        if (response.idToken) {
          localStorage.clear();
          localStorage.setItem('idToken', response.idToken);
          localStorage.setItem('localId', response.localId);
          this.router.navigate(['home']);
        }
      });
    }
  }
  extractCredential() {
    if (this.loginForm.valid) {
      if (this.passwordValidator()) {
        return (this.userLogin = {
          email: this.loginForm.controls.email.value,
          password: this.loginForm.controls.password.value,
          returnSecureToken: this.userLogin.returnSecureToken
        });
      }
    }
  }
  passwordValidator() {
    if (this.loginForm.controls.password.value === this.loginForm.controls.validatePassword.value) {
      return true;
    } else {
      this.loginForm.controls.password.setValue('');
      this.loginForm.controls.validatePassword.setValue('');
      return false;
    }
  }
}
