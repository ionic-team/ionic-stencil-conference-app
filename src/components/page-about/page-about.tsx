import { Component, Prop , h } from '@stencil/core';
import { popoverController } from '@ionic/core';

@Component({
  tag: 'page-about',
  styleUrl: 'page-about.css',
})
export class PageAbout {

  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: HTMLIonPopoverElement;

  async presentPopover(event: any) {
    const popover = await popoverController.create({
      component: 'page-about-popover',
      event
    });
    popover.present();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>About</ion-title>
          <ion-buttons slot="end">
            <ion-button onClick={this.presentPopover.bind(this)}>
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class="about-header">
          <img src="/assets/img/ionic-logo-white.svg" alt="ionic logo"/>
        </div>
        <div class="ion-padding about-info">
          <h4>Ionic Conference</h4>

          <ion-list no-lines>
            <ion-item>
              <ion-icon name="calendar" slot="start"></ion-icon>
              <ion-label>Date</ion-label>
              <ion-datetime displayFormat="MMM DD, YYYY" max="2056" value="2047-05-17"></ion-datetime>
            </ion-item>

            <ion-item>
              <ion-icon name="pin" slot="start"></ion-icon>
              <ion-label>Location</ion-label>
              <ion-select value="madison">
                <ion-select-option value="madison">Madison, WI</ion-select-option>
                <ion-select-option value="austin">Austin, TX</ion-select-option>
                <ion-select-option value="chicago">Chicago, IL</ion-select-option>
                <ion-select-option value="seattle">Seattle, WA</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>

          <p>
            The Ionic Conference is a one-day conference featuring talks from the Ionic team. It is focused on Ionic applications being
            built with Ionic 2. This includes migrating apps from Ionic 1 to Ionic 2, Angular concepts, Webpack, Sass, and many
            other technologies used in Ionic 2. Tickets are completely sold out, and we’re expecting more than 1000 developers
            – making this the largest Ionic conference ever!
          </p>
        </div>
      </ion-content>
    ];
  }
}
