import { Config, alertController, getMode, loadingController, modalController, toastController } from '@ionic/core';

import { Component, Element, forceUpdate, Listen, Prop, State , h } from '@stencil/core';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';


@Component({
  tag: 'page-schedule',
  styleUrl: 'page-schedule.css',
})
export class PageSchedule {
  excludeTracks: any = [];
  dayIndex = 0;
  scheduleList: HTMLIonListElement;
  fab: HTMLIonFabElement;
  ios: boolean;

  @Element() el: any;

  @State() groups: any = [];

  @State() shownSessions: any = [];

  @State() showSearchbar: boolean;

  @State() segment = 'all';

  @State() queryText = '';

  @Prop({ context: 'config' }) config: Config;

  componentWillLoad() {
    this.ios = getMode() === 'ios';

    this.updateSchedule();
  }

  componentDidLoad() {
    this.scheduleList = this.el.querySelector('#scheduleList');
    this.fab = this.el.querySelector('#socialFab');
  }

  segmentChanged(event: any) {
    this.segment = event.target.value;
    this.updateSchedule();
  }

  searchbarChanged(event: any) {
    this.queryText = event.target.value;
    this.updateSchedule();
  }

  @Listen('ionModalDidDismiss', { target: 'body' })
  modalDidDismiss(event: CustomEvent) {
    if (event) {
      this.excludeTracks = event.detail.data;
      this.updateSchedule();
    }
  }

  @Listen('ionLoadingWillDismiss', { target: 'body' })
  loadingWillDismiss() {
    this.fab.close();
  }

  async updateSchedule() {
    const data = await ConferenceData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment);
    this.shownSessions = data.shownSessions;
    this.groups = data.groups;

    forceUpdate(this.el);
  }

  async presentFilter() {
    const modal = await modalController.create({
      component: 'page-schedule-filter',
      swipeToClose: true,
      presentingElement: this.el.closest('ion-router-outlet'),
      componentProps: {
        excludedTracks: this.excludeTracks,
      }
    });
    await modal.present();
  }

  async addFavorite(session: any) {
    if (UserData.hasFavorite(session.name)) {
      // Prompt to remove favorite
      this.removeFavorite(session, 'Favorite already added');
    } else {
      // Add as a favorite
      UserData.addFavorite(session.name);

      // Create a toast
      const toast = await toastController.create({
        header: `${session.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      toast.present();
    }
  }

  async removeFavorite(session: any, title: string) {
    const alert = await alertController.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            UserData.removeFavorite(session.name);
            this.updateSchedule();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  async openSocial(social: string) {
    this.toggleList();
    const loading = await loadingController.create({
      message: `Posting to ${social}`,
      duration: (Math.random() * 1000) + 500
    });

    await loading.present();
  }

  toggleList() {
    const fabButton = this.fab.querySelector('ion-fab-button');
    fabButton.activated = !fabButton.activated;

    const fabList = this.fab.querySelector('ion-fab-list');
    fabList.activated = !fabList.activated;
  }

  render() {
    return [
      <ion-header translucent={true}>
        <ion-toolbar>
          { !this.showSearchbar &&
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
          }
          { this.ios &&
            <ion-segment value={this.segment} onIonChange={(ev) => this.segmentChanged(ev)}>
              <ion-segment-button value="all">
                All
              </ion-segment-button>
              <ion-segment-button value="favorites">
                Favorites
              </ion-segment-button>
            </ion-segment>
          }
          { !this.ios && !this.showSearchbar &&
            <ion-title>Schedule</ion-title>
          }
          { this.showSearchbar &&
            <ion-searchbar showCancelButton="always" value={this.queryText} placeholder="Search" onIonInput={(ev) => this.searchbarChanged(ev)} onIonCancel={() => this.showSearchbar = false }></ion-searchbar>
          }
          <ion-buttons slot="end">
            { !this.ios && !this.showSearchbar &&
              <ion-button onClick={() => this.showSearchbar = true}>
                <ion-icon slot="icon-only" name="search"></ion-icon>
              </ion-button>
            }
            { !this.showSearchbar &&
              <ion-button onClick={() => this.presentFilter()}>
                { this.ios && <span>Filter</span> }
                { !this.ios && <ion-icon slot="icon-only" name="options"></ion-icon> }
              </ion-button>
            }
          </ion-buttons>
        </ion-toolbar>

        { !this.ios &&
          <ion-toolbar>
            <ion-segment value={this.segment} onIonChange={(ev) => this.segmentChanged(ev)}>
              <ion-segment-button value="all">
                All
              </ion-segment-button>
              <ion-segment-button value="favorites">
                Favorites
              </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        }
      </ion-header>,

      <ion-content fullscreen={true}>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Schedule</ion-title>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar value={this.queryText} placeholder="Search" onIonInput={(ev) => this.searchbarChanged(ev)}></ion-searchbar>
          </ion-toolbar>
        </ion-header>

        <ion-list id="scheduleList" hidden={this.shownSessions === 0}>
          {this.groups.map(group =>
            <ion-item-group hidden={group.hide}>
              <ion-item-divider class="sticky">
                <ion-label>
                  {group.time}
                </ion-label>
              </ion-item-divider>

              {group.sessions.map(session =>
                <ion-item-sliding class={{ [`item-sliding-track-${session.tracks[0].toLowerCase()}`]: true, 'item-sliding-track': true }} hidden={session.hide}>
                  <ion-item href={`/schedule/session/${session.id}`}>
                    <ion-label>
                      <h3>{session.name}</h3>
                      <p>
                        {session.timeStart} &ndash; {session.timeEnd}: {session.location}
                      </p>
                    </ion-label>
                  </ion-item>
                  <ion-item-options>
                    {session.isFavorite === false
                      ? <ion-item-option color="favorite" onClick={() => this.addFavorite(session)}>
                        Favorite
                      </ion-item-option>

                      : <ion-item-option color="danger" onClick={() => this.removeFavorite(session, 'Remove Favorite')}>
                        Remove
                      </ion-item-option>
                    }
                  </ion-item-options>
                </ion-item-sliding>
              )}
            </ion-item-group>
          )}
        </ion-list>

        <ion-list-header hidden={this.shownSessions > 0}>
          No Sessions Found
        </ion-list-header>

        <ion-fab id="socialFab" vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button onClick={() => this.toggleList()}>
            <ion-icon name="share-social"></ion-icon>
          </ion-fab-button>

          <ion-fab-list side="top">
            <ion-fab-button color="vimeo" onClick={() => this.openSocial('Vimeo')}>
              <ion-icon name="logo-vimeo"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="instagram" onClick={() => this.openSocial('Instagram')}>
              <ion-icon name="logo-instagram"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="twitter" onClick={() => this.openSocial('Twitter')}>
              <ion-icon name="logo-twitter"></ion-icon>
            </ion-fab-button>
            <ion-fab-button color="facebook" onClick={() => this.openSocial('Facebook')}>
              <ion-icon name="logo-facebook"></ion-icon>
            </ion-fab-button>
          </ion-fab-list>
        </ion-fab>
      </ion-content>
    ];
  }
}
