import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'page-tabs',
  styleUrl: 'page-tabs.css',
})
export class PageTabs {

  @Prop({ connect: 'ion-menu-controller' }) menuCtrl: HTMLIonMenuControllerElement;

  async componentDidLoad() {
    const menuCtlr: HTMLIonMenuControllerElement = await (this.menuCtrl as any).componentOnReady();
    menuCtlr.enable(true);
  }
  render() {
    return [
      <ion-tabs>
        <ion-tab label="Schedule" icon="calendar" name="tab-schedule">
          <ion-nav></ion-nav>
        </ion-tab>
        <ion-tab label="Speakers" icon="contacts" name="tab-speaker">
          <ion-nav></ion-nav>
        </ion-tab>
        <ion-tab label="Map" icon="map" component="page-map"></ion-tab>
        <ion-tab label="About" icon="information-circle" component="page-about"></ion-tab>
      </ion-tabs>
    ];
  }
}
