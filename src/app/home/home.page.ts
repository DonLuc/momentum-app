import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BankingService } from '../service/banking.service';
import { json } from '@angular-devkit/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  accounts: any[] = [];
  private idToken = null;
  private localId = null;
  constructor(private bankingService: BankingService, private route: Router, private alertController: AlertController) {
    this.getAuth();
    this.accountDetails();
  }

  ngOnInit(): void {
  }

  accountDetails() {
    this.bankingService.clientDetails(this.localId, this.idToken).subscribe((response: any) => {
      console.log('RESPONSE: ' + JSON.stringify(response));
      if (response) {
        this.accounts = response.accounts;
      }
    });
  }

  openAccount(account: string) {
    localStorage.setItem('account', account);
    this.route.navigate(['account']);
  }

  updateAccounts() {
    this.accounts.push(Math.floor(Math.random() * 10000000000));
    this.bankingService.updateAccountList(this.localId, this.idToken, this.accounts).subscribe((response) => {
      if (response) {
        this.presentAlert('Account created successfully');
      } else {
        this.presentAlert('Error in creating account');
      }
    });
  }

  getAuth() {

    this.idToken = localStorage.getItem('idToken');
    this.localId = localStorage.getItem('localId');
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: "New account",
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
