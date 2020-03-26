import { Component, State, h } from '@stencil/core';

import { popoverController } from '@ionic/core';

@Component({
  tag: 'page-about',
  styleUrl: 'page-about.css',
})
export class PageAbout {
  selectOptions = {
    header: 'Select a Location'
  };

  @State() conferenceDate = '2047-05-17T00:00:00-05:00';

  @State() location = 'madison';

  selectChanged(event: any) {
    this.location = event.detail.value;
  }

  datetimeChanged(event: any) {
    this.conferenceDate = event.detail.value;
  }

  // momentjs would be a better way to do this https://momentjs.com/
  displayDate(date: string, format: string) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const d = new Date(date);
    const year = d.getFullYear();

    if (format === 'y') {
      return year;
    } else {
      const month = monthNames[d.getMonth()];
      const day = d.getDate();

      return month + ' ' + day + ', ' + year;
    }
  }

  async presentPopover(event: any) {
    const popover = await popoverController.create({
      component: 'page-about-popover',
      event
    });
    popover.present();
  }

  render() {
    return [
      <ion-content>
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button onClick={this.presentPopover.bind(this)}>
                <ion-icon slot="icon-only" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <div class="about-header">
          {/* Instead of loading an image each time the select changes, use opacity to transition them */}


          <div class="about-image madison" style={{ opacity: this.location === 'madison' ? '1' : null }}></div>
          <div class="about-image austin" style={{ opacity: this.location === 'austin' ? '1' : null }}></div>
          <div class="about-image chicago" style={{ opacity: this.location === 'chicago' ? '1' : null }}></div>
          <div class="about-image seattle" style={{ opacity: this.location === 'seattle' ? '1' : null }}></div>
        </div>

        <div class="about-info">
          <h3 class="ion-padding-top ion-padding-start">About</h3>

          <p class="ion-padding-start ion-padding-end">
            The Ionic Conference is a one-day conference on { this.displayDate(this.conferenceDate, 'mediumDate') } featuring talks from the Ionic team. It is focused on Ionic applications being built with Ionic Framework. This includes migrating apps to the latest version of the framework, Angular concepts, Webpack, Sass, and many other technologies used in Ionic 2. Tickets are completely sold out, and we’re expecting more than 1000 developers – making this the largest Ionic conference ever!
          </p>

          <h3 class="ion-padding-top ion-padding-start">Details</h3>

          <ion-list lines="none">
            <ion-item>
              <ion-label>
                Location
              </ion-label>
              <ion-select value={this.location} interfaceOptions={this.selectOptions} onIonChange={(ev) => this.selectChanged(ev)}>
                <ion-select-option value="madison">Madison, WI</ion-select-option>
                <ion-select-option value="austin">Austin, TX</ion-select-option>
                <ion-select-option value="chicago">Chicago, IL</ion-select-option>
                <ion-select-option value="seattle">Seattle, WA</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label>
                Date
              </ion-label>
              <ion-datetime displayFormat="MMM DD, YYYY" max="2056" value={this.conferenceDate} onIonChange={(ev) => this.datetimeChanged(ev)}></ion-datetime>
            </ion-item>
          </ion-list>

          <h3 class="ion-padding-top ion-padding-start">Internet</h3>

          <ion-list lines="none">
            <ion-item>
              <ion-label>
                Wifi network
              </ion-label>
              <ion-label class="ion-text-end">
                ica{ this.displayDate(this.conferenceDate, 'y') }
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                Password
              </ion-label>
              <ion-label class="ion-text-end">
                makegoodthings
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ion-content>
    ];
  }
}
