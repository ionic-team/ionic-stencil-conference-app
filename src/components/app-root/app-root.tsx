import '@ionic/core';

import { Component, Element, Listen, Prop, State, h } from '@stencil/core';
import { UserData } from '../../providers/user-data';
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  hasSeenTutorial = false;

  @Element() el: any;

  @State() dark = false;

  @State() loggedIn = false;

  @Prop({ context: 'isServer' }) isServer: boolean;

  @Listen('ionRouteWillChange')
  routeChanged() {
    this.el.forceUpdate();
  }

  async componentWillLoad() {
    this.hasSeenTutorial = this.isServer
      ? true
      : await UserData.checkHasSeenTutorial();
  }

  async componentDidLoad() {
    this.checkLoginStatus();
    try {
      await SplashScreen.hide();
    } catch {
      return;
    }
  }

  async checkLoginStatus() {
    const loggedIn = this.loggedIn = await UserData.isLoggedIn();
    return loggedIn;
  }

  @Listen('userDidLogIn')
  @Listen('userDidLogOut')
  updateLoggedInStatus(loggedEvent) {
    this.loggedIn = loggedEvent.detail.loginStatus;
  }

  renderRouter() {
    return (
      <ion-router useHash={false}>
        <ion-route-redirect from="/" to={this.hasSeenTutorial ? '/schedule' : '/tutorial'} />

        <ion-route component="page-tabs">
          <ion-route url="/schedule" component="tab-schedule">
            <ion-route component="page-schedule"></ion-route>
            <ion-route url="/session/:sessionId" component="page-session" componentProps={{ goback: '/schedule' }}></ion-route>
          </ion-route>

          <ion-route url="/speakers" component="tab-speaker">
            <ion-route component="page-speaker-list"></ion-route>
            <ion-route url="/session/:sessionId" component="page-session" componentProps={{ goback: '/speakers' }}></ion-route>
            <ion-route url="/:speakerId" component="page-speaker-detail"></ion-route>
          </ion-route>

          <ion-route url="/map" component="tab-map"></ion-route>

          <ion-route url="/about" component="tab-about"></ion-route>
        </ion-route>

        <ion-route url="/tutorial" component="page-tutorial"></ion-route>
        <ion-route url="/login" component="page-login"></ion-route>
        <ion-route url="/account" component="page-account"></ion-route>
        <ion-route url="/signup" component="page-signup"></ion-route>
        <ion-route url="/support" component="page-support"></ion-route>
      </ion-router>
    );
  }

  render() {
    return (
      <ion-app class={{
        'dark-theme': this.dark
      }}>
        {this.renderRouter()}
        <ion-split-pane content-id="menu-content">
          <component-menu loggedIn={this.loggedIn}></component-menu>

          <ion-router-outlet animated={false} id="menu-content"></ion-router-outlet>
        </ion-split-pane>
      </ion-app>
    );
  }
}

