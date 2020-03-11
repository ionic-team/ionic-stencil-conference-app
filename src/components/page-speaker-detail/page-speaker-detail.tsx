import { actionSheetController, getMode } from '@ionic/core';
import { Component, Prop, h } from '@stencil/core';
import { ConferenceData } from '../../providers/conference-data';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  tag: 'page-speaker-detail',
  styleUrl: 'page-speaker-detail.css'
})
export class PageSpeakerDetail {
  private speaker: any;

  @Prop() speakerId: string;

  async componentWillLoad() {
    this.speaker = await ConferenceData.getSpeaker(this.speakerId);
  }

  openExternalUrl(url: string) {
    Browser.open({
      url
    });
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await actionSheetController.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any)['cordova'] &&
              (window as any)['cordova'].plugins.clipboard
            ) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  async openContact(speaker: any) {
    const mode = getMode();

    const actionSheet = await actionSheetController.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }

  render() {
    const speaker = this.speaker;

    return [
      <ion-content>
        <ion-header class="ion-no-border">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/speakers"></ion-back-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button onClick={() => this.openContact(speaker)}>
                <ion-icon slot="icon-only" ios="call-outline" md="call-sharp"></ion-icon>
              </ion-button>
              <ion-button onClick={() => this.openSpeakerShare(speaker)}>
                <ion-icon slot="icon-only" ios="share-outline" md="share-sharp"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <div class="speaker-background">
          <img src={speaker.profilePic} alt={speaker.name}/>
          <h2>{speaker.name}</h2>
        </div>

        <div class="ion-padding speaker-detail">
          <p>{speaker.about} Say hello on social media!</p>

          <hr/>

          <ion-chip color="twitter" onClick={() => this.openExternalUrl(`https://twitter.com/${speaker.twitter}`)}>
            <ion-icon name="logo-twitter"></ion-icon>
            <ion-label>Twitter</ion-label>
          </ion-chip>

          <ion-chip color="dark" onClick={() => this.openExternalUrl('https://github.com/ionic-team/ionic')}>
            <ion-icon name="logo-github"></ion-icon>
            <ion-label>GitHub</ion-label>
          </ion-chip>

          <ion-chip color="instagram" onClick={() => this.openExternalUrl('https://instagram.com/ionicframework')}>
            <ion-icon name="logo-instagram"></ion-icon>
            <ion-label>Instagram</ion-label>
          </ion-chip>
        </div>
      </ion-content>
    ];
  }
}
