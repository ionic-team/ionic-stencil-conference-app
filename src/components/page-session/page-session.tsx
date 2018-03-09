import { Component, Prop, State } from '@stencil/core';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

@Component({
  tag: 'page-session',
  styleUrl: 'page-session.css',
})
export class PageSession {

  private session: any;
  @State() isWatched: boolean;
  @State() isFavorite: boolean;
  @Prop() sessionId: string;
  @Prop() goback = '/';

  async componentWillLoad() {
    this.session = await ConferenceData.getSession(this.sessionId);
    this.isFavorite = UserData.hasFavorite(this.session.name);
    this.isWatched = UserData.hasWatch(this.session.name);
  }

  toggleWatch() {
    if (UserData.hasWatch(this.session.name)) {
      UserData.removeWatch(this.session.name);
      this.isWatched = false;
    } else {
      UserData.addWatch(this.session.name);
      this.isWatched = true;
    }
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
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
            <ion-back-button defaultHref={this.goback}/>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button onClick={() => this.toggleFavorite()}>
              <ion-icon slot="icon-only" name="star" class={this.isFavorite ? 'session-is-favorite' : ''}></ion-icon>
            </ion-button>
            <ion-button>
              <ion-icon slot="icon-only" name="share"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div padding>
          {this.session.tracks.map(track =>
            <span class={{[`session-track-${track.toLowerCase()}`]: true}}>
              { track }
            </span>
          )}
          <div>Session {this.sessionId}</div>

          <h1>{this.session.name}</h1>

          <p>{this.session.description}</p>

          <ion-text color="medium">
            {this.session.timeStart} &ndash; {this.session.timeEnd}<br/>
            {this.session.location}
          </ion-text>
        </div>

        <ion-list>
          {
            this.isWatched ?
            <ion-item onClick={() => this.toggleWatch()}>
              <ion-label color="primary">Mark as Unwatched</ion-label>
            </ion-item>
            :
            <ion-item onClick={() => this.toggleWatch()}>
              <ion-label color="primary">Watch</ion-label>
            </ion-item>
          }

          <ion-item onClick={() => this.sessionClick('add to calendar')}>
            <ion-label color="primary">Add to Calendar</ion-label>
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
