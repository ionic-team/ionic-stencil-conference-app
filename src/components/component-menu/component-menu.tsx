import { Component, Prop, State, h} from '@stencil/core';

import { UserData } from '../../providers/user-data';

@Component({
  tag: 'component-menu',
  styleUrl: 'component-menu.css',
})
export class PageAbout {
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

  @Prop() loggedIn: boolean;

  @State() dark = false;

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

  async logout() {
    await UserData.logout();
    this.loggedIn = false;
  }

  render() {
    return [
      <ion-menu contentId="menu-content">
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
    ];
  }
}
