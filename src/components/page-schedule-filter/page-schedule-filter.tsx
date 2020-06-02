import { Config, getMode } from '@ionic/core';
import { Component, Element, forceUpdate, Prop, State , h } from '@stencil/core';

import { ConferenceData } from '../../providers/conference-data';


@Component({
  tag: 'page-schedule-filter',
  styleUrl: 'page-schedule-filter.css',
})
export class PageScheduleFilter {
  ios: boolean;

  @Element() el: any;

  @State() tracks: {name: string, icon: string, isChecked: boolean}[] = [];

  @Prop({ context: 'config' }) config: Config;

  @Prop() excludedTracks: string[] = [];

  async componentWillLoad() {
    this.ios = getMode() === 'ios';

    // passed in array of track names that should be excluded (unchecked)
    // TODO = this.navParams.data.excludedTracks;
    const excludedTrackNames = this.excludedTracks;

    const tracks = await ConferenceData.getTracks();

    this.tracks = tracks.map(track => ({
      name: track.name,
      icon: track.icon,
      isChecked: (excludedTrackNames.indexOf(track.name) === -1)
    }));
  }

  dismiss(data?: any) {
    // dismiss this modal and pass back data
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.tracks.forEach(track => {
      track.isChecked = check;
    });
    forceUpdate(this.el);
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  // reset all of the toggles to be checked
  resetFilters() {
    this.tracks.forEach(track => {
      track.isChecked = true;
    });
    forceUpdate(this.el);
  }

  checkboxChanged(ev: CustomEvent) {
    const track = this.tracks.find(({ name }) => name === (ev.target as any).name);
    track.isChecked = (ev.target as any).checked;
  }

  render() {
    return [
      <ion-header translucent={true}>
        <ion-toolbar>

          <ion-buttons slot="start">
            { this.ios &&
              <ion-button onClick={() => this.dismiss()}>Cancel</ion-button>
            }
            { !this.ios &&
              <ion-button onClick={() => this.selectAll(false)}>Reset</ion-button>
            }
          </ion-buttons>

          <ion-title>
            Filter Sessions
          </ion-title>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.applyFilters()} strong>Done</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-list lines={ this.ios ? 'inset' : 'full'}>
          <ion-list-header>Tracks</ion-list-header>

          {this.tracks.map(track =>
            <ion-item class={{ [`item-track-${track.name.toLowerCase()}`]: true, 'item-track': true }}>
              { this.ios && <ion-icon slot="start" name={track.icon} color="medium"></ion-icon> }
              <ion-label>{track.name}</ion-label>
              <ion-checkbox checked={track.isChecked} color="primary" name={track.name} onIonChange={(ev) => this.checkboxChanged(ev)}></ion-checkbox>
            </ion-item>
          )}
        </ion-list>
      </ion-content>,

      this.ios &&
        <ion-footer translucent={true}>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button onClick={() => this.selectAll(false)}>Deselect All</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button onClick={() => this.selectAll(true)}>Select All</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-footer>
    ];
  }
}
