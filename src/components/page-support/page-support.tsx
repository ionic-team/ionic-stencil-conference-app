import '@ionic/core';
import '@stencil/core';

import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'page-support',
  styleUrl: 'page-support.css',
})
export class PageSupport {
  supportMessage = '';
  supportQuestion = {
    valid: false
  };
  submitted = false;

  @Prop({ connect: 'ion-alert-controller' }) alertCtrl: HTMLIonAlertControllerElement;

  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;

  async componentDidEnter() {
    const toast = await this.toastCtrl.create({
      message: 'This does not actually send a support request.',
      duration: 3000
    });
    toast.present();
  }

  async submit() {
    this.submitted = true;

    if (this.supportQuestion.valid) {
      this.supportMessage = '';
      this.submitted = false;

      const toast = await this.toastCtrl.create({
        message: 'Your support request has been sent.',
        duration: 3000
      });
      toast.present();
    }
  }

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  ionViewCanLeave() {
    // If the support message is empty we should just navigate
    if (!this.supportMessage || this.supportMessage.trim().length === 0) {
      return true;
    }

    // return new Promise((resolve: any, reject: any) => {
    //   const alert = this.alertCtrl.create({
    //     title: 'Leave this page?',
    //     message: 'Are you sure you want to leave this page? Your support message will not be submitted.',
    //     buttons: [
    //       { text: 'Stay', handler: reject },
    //       { text: 'Leave', role: 'cancel', handler: resolve }
    //     ]
    //   });

    //   alert.present();
    // });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
          <ion-back-button/>
          </ion-buttons>
          <ion-title>Support</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class="support-logo">
          <img src="assets/img/appicon.svg" alt="Ionic Logo"/>
        </div>

        <form novalidate>
          <ion-list no-lines>
            <ion-item>
              <ion-label stacked color="primary">Enter your support message below</ion-label>
              <ion-textarea name="supportQuestion" rows={6} required></ion-textarea>
            </ion-item>
          </ion-list>

          <ion-text color="danger">
            <p hidden={this.supportQuestion.valid || this.submitted === false} padding-left>
              Support message is required
            </p>
          </ion-text>

          <div padding>
            <ion-button expand="block" type="submit">Submit</ion-button>
          </div>
        </form>
      </ion-content>
    ];
  }
}
