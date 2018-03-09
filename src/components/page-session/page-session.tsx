import { Component, Prop, State } from '@stencil/core';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { NavControllerBase } from '@ionic/core';

@Component({
  tag: 'page-session',
  styleUrl: 'page-session.css',
})
export class PageSession {

  private session: any;
  @State() isFavorite: boolean;
  @Prop() sessionId: string;
  @Prop() goback = '/';

  @Prop({ connect: 'ion-nav' })
  nav: NavControllerBase;

  async componentWillLoad() {
    this.session = await ConferenceData.getSession(this.sessionId);
    this.isFavorite = UserData.hasFavorite(this.session.name);
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  async navigateToSpeaker(speaker) {
    const nav: NavControllerBase = await (this.nav as any).componentOnReady();
    nav.push('page-speaker-detail', {speakerId: speaker.id}, { animate: true, direction: 'forward' });
  }
  
  toggleFavorite() {
    if (UserData.hasFavorite(this.session.name)) {
      UserData.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      UserData.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button defaultHref={this.goback}></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div padding>
          <ion-grid no-padding>
            <ion-row>
              <ion-col col-6>
                {this.session.tracks.map(track =>
                  <span class={{[`session-track-${track.toLowerCase()}`]: true}}>
                    { track }
                  </span>
                )}
                <div>Session {this.sessionId}</div>
              </ion-col>
              <ion-col col-6 text-right>
                <ion-icon onClick={() => this.toggleFavorite()} name={this.isFavorite ? 'heart' : 'heart-empty'} color={this.isFavorite ? 'danger' : ''} size="large"></ion-icon>
              </ion-col>
            </ion-row>
          </ion-grid>

          <h1>{this.session.name}</h1>

          <p>{this.session.description}</p>

          <ion-text color="medium">
            {this.session.timeStart} &ndash; {this.session.timeEnd}<br/>
            {this.session.location}
          </ion-text>
        </div>

        <ion-list>
          <ion-list-header>
            Speakers
          </ion-list-header>
          {this.session.speakers.map(speaker =>
            <ion-item detail-none onClick={() => this.navigateToSpeaker(speaker)}>
              <ion-avatar item-start>
                <img src={speaker.profilePic}></img>
              </ion-avatar>
              <h3>{speaker.name}</h3>
            </ion-item>
          )}
        </ion-list>

        <ion-list>
          <ion-item onClick={() => this.sessionClick('watch')}>
            <ion-label color="primary">Watch</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('add to calendar')}>
            <ion-label color="primary">Add to Calendar</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('mark as unwatched')}>
            <ion-label color="primary">Mark as Unwatched</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('download video')}>
            <ion-label color="primary">Download Video</ion-label>
            <ion-icon slot="end" color="primary" size="small" name="cloud-download"></ion-icon>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('leave feedback')}>
            <ion-label color="primary">Leave Feedback</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }
}
