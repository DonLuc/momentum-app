import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BankingService } from './../service/banking.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  private account = {
    number: '',
    balance: 0,
    overdraft: 0
  }

  private operationForm: FormGroup;
  private idToken = null;
  private localId = null;
  private operation = null;
  private operations = [
    {
      operation: 'Deposit',
      icon: 'md-cash'
    },
    {
      operation: 'Withdraw',
      icon: 'md-cash'
    }
  ];


  constructor(private bankingService: BankingService, private alertController: AlertController) {
    this.getAuth();
    this.createOperationForm();
  }

  ngOnInit() {
    this.getAccountNumber();
    this.getAccount();
  }

  getAccountNumber() {
    this.account.number = localStorage.getItem('account');
  }

  getAccount() {
    this.bankingService.getAccount(this.account.number, this.idToken).subscribe((response: any) => {
      if (response) {
        this.account.balance = response.balance;
        this.account.overdraft = response.overdraft;
      }
    });
  }

  doOperation(operation: string) {
    this.operationForm.controls.amount.setValue('');
    this.operation = operation.toLowerCase();
  }

  createOperationForm() {
    return (this.operationForm = new FormGroup({
      amount: new FormControl(null, Validators.required),
    }));
  }

  getAuth() {
    this.idToken = localStorage.getItem('idToken');
    this.localId = localStorage.getItem('localId');
  }


  updateAccount() {
    let updatedBalance = 0;
    let message = '';
    switch (this.operation) {
      case 'deposit':
        updatedBalance = this.account.balance + parseFloat(this.operationForm.controls.amount.value);
        message = `Deposited R${this.operationForm.controls.amount.value} successfully!`;
        break;
      case 'withdraw':
        updatedBalance = this.account.balance - parseFloat(this.operationForm.controls.amount.value);
        message = `Withdrew R${this.operationForm.controls.amount.value} successfully!`;
        break;
      default:
        break;
    }

    this.bankingService.updateAccount(this.account.number, this.idToken,
      {
        balance: updatedBalance,
        overdraft: this.account.overdraft
      }).subscribe((response: any) => {
        if (response) {
          this.account.balance = response.balance;
          this.account.overdraft = response.overdraft;
          this.presentAlert(this.operation, this.account.number, message);
          this.clearAmount();
        } else {
          const message = `Error occurred while trying ${this.operation}!`
          this.presentAlert(this.operation, this.account.number, message);
          this.clearAmount();
        }
      });
  }

  async presentAlert(operation, account, message) {
    const alert = await this.alertController.create({
      header: operation,
      subHeader: account,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  clearAmount() {
    this.operationForm.controls.amount.setValue("");
  }
}
