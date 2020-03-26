import { Component, Event, EventEmitter, Prop, State , h } from '@stencil/core';
import { UserData } from '../../providers/user-data';

import { alertController } from '@ionic/core';

@Component({
  tag: 'page-account',
})
export class PageAccount {

  @State() user;

  @Prop({ connect: 'ion-router' }) nav: HTMLIonRouterElement;

  @Event() userDidLogOut: EventEmitter;

  componentDidLoad() {
    this.getUser();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  async getUser() {
    this.user = await UserData.getUsername();
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  async logout() {
    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    await UserData.logout();
    this.userDidLogOut.emit({ loginStatus: false });
    navCtrl.push('/schedule', 'root');
  }

  async support() {
    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    navCtrl.push('/support', 'root');
  }

  async changeUsername() {
    const alert = await alertController.create({
      header: 'Change Username',
      inputs: [
        {
          type: 'text',
          name: 'username',
          id: 'userName',
          placeholder: 'username',
          value: this.user
        },

      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Ok',
          handler: (data) => {
            UserData.setUsername(data.username);
            this.getUser();
          }
        }
      ]
    });
    alert.present();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
            <ion-menu-button></ion-menu-button>
          </ion-buttons>

          <ion-title>Account</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

        <div class="ion-padding-top ion-text-center">
          <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
          <h2>{this.user}</h2>
          <ion-list>
            <ion-item onClick={() => this.updatePicture()}>Update Picture</ion-item>
            <ion-item onClick={() => this.changeUsername()}>Change Username</ion-item>
            <ion-item onClick={() => this.changePassword()}>Change Password</ion-item>
            <ion-item onClick={() => this.support()}>Support</ion-item>
            <ion-item onClick={() => this.logout()}>Logout</ion-item>
          </ion-list>
        </div>
      </ion-content>

    ];
  }
}
