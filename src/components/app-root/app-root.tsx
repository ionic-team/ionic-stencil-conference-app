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

  appPages = [
    {
      title: 'Schedule',
      url: '/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/speakers',
      icon: 'people'
    },
    {
      title: 'Map',
      url: '/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle'
    }
  ];

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

  async logout() {
    await UserData.logout();
    this.loggedIn = false;
  }

  toggleChanged(event: any) {
    this.dark = event.target.checked;
  }

  isActiveUrl(url: string) {
    const current = window.location.pathname;

    if (current.includes(url)) {
      return true;
    }

    return false;
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
          <ion-menu content-id="menu-content">
            <ion-content forceOverscroll={false}>
              <ion-list lines="none">
                <ion-list-header>Conference</ion-list-header>

                {this.appPages.map((p) => (
                  <ion-menu-toggle autoHide={false}>
                    <ion-item detail={false} href={p.url} class={{ 'selected': this.isActiveUrl(p.url) }}>
                      <ion-icon slot="start" name={p.icon + '-outline'}></ion-icon>
                      <ion-label>{p.title}</ion-label>
                    </ion-item>
                  </ion-menu-toggle>
                ))}
              </ion-list>

              <ion-list lines="none">
                <ion-list-header>Account</ion-list-header>

                <ion-menu-toggle autoHide={false}>
                  {this.loggedIn ? (
                    <ion-item detail={false} href="account" class={{ 'selected': this.isActiveUrl('/account') }}>
                      <ion-icon slot="start" name="person"></ion-icon>
                      <ion-label>Account</ion-label>
                    </ion-item>
                  ) : (
                    <ion-item detail={false} href="login" class={{ 'selected': this.isActiveUrl('/login') }}>
                      <ion-icon slot="start" name="log-in"></ion-icon>
                      <ion-label>Login</ion-label>
                    </ion-item>
                  )}
                </ion-menu-toggle>

                <ion-menu-toggle autoHide={false}>
                  <ion-item detail={false} href="support" class={{ 'selected': this.isActiveUrl('/support') }}>
                    <ion-icon slot="start" name="help"></ion-icon>
                    <ion-label>Support</ion-label>
                  </ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle autoHide={false}>
                  {this.loggedIn ? (
                    <ion-item detail={false} onClick={() => this.logout()} button>
                      <ion-icon slot="start" name="log-out"></ion-icon>
                      <ion-label>Logout</ion-label>
                    </ion-item>
                  ) : (
                    <ion-item detail={false} href="signup" button class={{ 'selected': this.isActiveUrl('/signup') }}>
                      <ion-icon slot="start" name="person-add"></ion-icon>
                      <ion-label>Signup</ion-label>
                    </ion-item>
                  )}
                </ion-menu-toggle>

                <ion-item>
                  <ion-icon slot="start" name="moon-outline"></ion-icon>
                  <ion-label>
                    Dark Mode
                  </ion-label>
                  <ion-toggle checked={this.dark} onIonChange={(ev) => this.toggleChanged(ev)}></ion-toggle>
                </ion-item>
              </ion-list>

              <ion-list lines="none">
                <ion-list-header>Tutorial</ion-list-header>
                <ion-menu-toggle autoHide={false}>
                  <ion-item detail={false} href="tutorial">
                    <ion-icon slot="start" name="hammer"></ion-icon>
                    <ion-label>Show Tutorial</ion-label>
                  </ion-item>
                </ion-menu-toggle>
              </ion-list>
            </ion-content>
          </ion-menu>

          <ion-router-outlet animated={false} id="menu-content"></ion-router-outlet>
        </ion-split-pane>
      </ion-app>
    );
  }
}

