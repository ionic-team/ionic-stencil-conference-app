import { Component, Prop , h } from '@stencil/core';

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;
import { ConferenceData } from '../../providers/conference-data';

@Component({
  tag: 'page-speaker-list',
  styleUrl: 'page-speaker-list.css'
})
export class PageSpeakerList {

  mode!: string;

  speakers: any[] = [];
  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl: HTMLIonActionSheetControllerElement;


  async componentWillLoad() {
    this.speakers = await ConferenceData.getSpeakers();
  }

  goToSpeakerTwitter(speaker: any) {
    console.log('goToSpeakerTwitter', speaker);

    Browser.open({
      url: `https://twitter.com/${speaker.twitter}`
    });
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
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
    const mode = this.mode;

    const actionSheet = await this.actionSheetCtrl.create({
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
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Speakers</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="outer-content">
        <ion-list>
          <ion-grid fixed>
            <ion-row align-items-stretch>
              {this.speakers.map(speaker => (
                <ion-col size="12" size-md="6">
                  <ion-card class="speaker-card">
                    <ion-card-header>
                      <ion-item detail-none href={`/speakers/${speaker.id}`}>
                        <ion-avatar slot="start">
                          <img src={speaker.profilePic} alt="Speaker profile pic"/>
                        </ion-avatar>
                        {speaker.name}
                      </ion-item>
                    </ion-card-header>

                    <ion-card-content>
                      <ion-list>
                        {speaker.sessions.map(session => (
                          <ion-item href={`/speakers/session/${session.id}`}>
                            <h3>{session.name}</h3>
                          </ion-item>
                        ))}

                        <ion-item href={`/speakers/${speaker.id}`}>
                          <h3>About {speaker.name}</h3>
                        </ion-item>
                      </ion-list>
                    </ion-card-content>

                    <ion-row no-padding justify-content-center>
                      <ion-col size="4" text-left>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.goToSpeakerTwitter(speaker)}>
                          <ion-icon name="logo-twitter" slot="start"></ion-icon>
                          Tweet
                        </ion-button>
                      </ion-col>
                      <ion-col size="4" text-center>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.openSpeakerShare(speaker)}>
                          <ion-icon name="share-alt" slot="start"></ion-icon>
                          Share
                        </ion-button>
                      </ion-col>
                      <ion-col size="4" text-right>
                        <ion-button
                          fill="clear"
                          size="small"
                          color="primary"
                          onClick={() => this.openContact(speaker)}>
                          <ion-icon name="chatboxes" slot="start"></ion-icon>
                          Contact
                        </ion-button>
                      </ion-col>
                    </ion-row>
                  </ion-card>
                </ion-col>
              ))}
            </ion-row>
          </ion-grid>
        </ion-list>
      </ion-content>
    ];
  }
}
