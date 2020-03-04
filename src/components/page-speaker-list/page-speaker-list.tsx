import { Component, h } from '@stencil/core';
import { Plugins } from '@capacitor/core';

import { ConferenceData } from '../../providers/conference-data';

const { Browser } = Plugins;

@Component({
  tag: 'page-speaker-list',
  styleUrl: 'page-speaker-list.css'
})
export class PageSpeakerList {
  mode!: string;

  speakers: any[] = [];

  async componentWillLoad() {
    this.speakers = await ConferenceData.getSpeakers();
  }

  goToSpeakerTwitter(speaker: any) {
    Browser.open({
      url: `https://twitter.com/${speaker.twitter}`
    });
  }

  render() {
    return [
      <ion-header translucent={true}>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Speakers</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content fullscreen={true}>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Speakers</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-grid fixed>
          <ion-row>
            {this.speakers.map(speaker => (
              <ion-col size="12" size-md="6">
                <ion-card class="speaker-card">
                  <ion-card-header>
                    <ion-item detail={false} lines="none" class="speaker-item" href={`/speakers/${speaker.id}`}>
                      <ion-avatar slot="start">
                        <img src={speaker.profilePic} alt={speaker.name + ' profile pic'}/>
                      </ion-avatar>
                      <ion-label>
                        <h2>{speaker.name}</h2>
                        <p>{speaker.title}</p>
                      </ion-label>
                    </ion-item>
                  </ion-card-header>

                  <ion-card-content>
                    <ion-list lines="none">
                      {speaker.sessions.map(session => (
                        <ion-item detail={false} href={`/speakers/session/${session.id}`}>
                          <ion-label>
                            <h3>{session.name}</h3>
                          </ion-label>
                        </ion-item>
                      ))}

                      <ion-item detail={false} href={`/speakers/${speaker.id}`}>
                        <ion-label>
                          <h3>About {speaker.name}</h3>
                        </ion-label>
                      </ion-item>
                    </ion-list>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            ))}
          </ion-row>
        </ion-grid>
      </ion-content>
    ];
  }
}
