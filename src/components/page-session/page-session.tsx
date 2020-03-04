import { Component, Prop, State , h } from '@stencil/core';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

@Component({
  tag: 'page-session',
  styleUrl: 'page-session.css'
})
export class PageSession {
  private session: any;
  @State() isFavorite: boolean;
  @Prop() sessionId: string;
  @Prop() goback = '/';

  async componentWillLoad() {
    this.session = await ConferenceData.getSession(this.sessionId);
    this.isFavorite = UserData.hasFavorite(this.session.name);
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

  shareSession() {
    console.log('Clicked share session');
  }

  render() {
    const { session } = this;

    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref={this.goback}></ion-back-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button onClick={() => this.toggleFavorite()}>
              { !this.isFavorite && <ion-icon slot="icon-only" name="star-outline"></ion-icon> }
              { this.isFavorite && <ion-icon slot="icon-only" name="star"></ion-icon> }
            </ion-button>
            <ion-button onClick={() => this.shareSession()}>
              <ion-icon slot="icon-only" name="share"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class="ion-padding">
          <h1>{session.name}</h1>
          {session.tracks.map(track => (
            <span class={{ [`session-track-${track.toLowerCase()}`]: true }}>
              {track}
            </span>
          ))}
          <p>{session.description}</p>
          <ion-text color="medium">
            {session.timeStart} &ndash; {session.timeEnd}
            <br /> {session.location}
          </ion-text>
        </div>

        <ion-list>
          <ion-item onClick={() => this.sessionClick('watch')} button>
            <ion-label color="primary">Watch</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('add to calendar')} button>
            <ion-label color="primary">Add to Calendar</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('mark as unwatched')} button>
            <ion-label color="primary">Mark as Unwatched</ion-label>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('download video')} button>
            <ion-label color="primary">Download Video</ion-label>
            <ion-icon slot="end" color="primary" size="small" name="cloud-download"></ion-icon>
          </ion-item>
          <ion-item onClick={() => this.sessionClick('leave feedback')} button>
            <ion-label color="primary">Leave Feedback</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    ];
  }
}
