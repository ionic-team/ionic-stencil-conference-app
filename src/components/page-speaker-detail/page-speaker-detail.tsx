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
    console.log('open url', url);
    Browser.open({
      url
    });
  }

  render() {
    const speaker = this.speaker;

    return [
      <ion-content>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/speakers"></ion-back-button>
            </ion-buttons>
            <ion-buttons slot="end">

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
