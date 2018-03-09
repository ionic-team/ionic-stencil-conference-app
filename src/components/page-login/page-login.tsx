import '@ionic/core';
import '@stencil/core';

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { NavControllerBase } from '@ionic/core';
import { UserData } from '../../providers/user-data';

@Component({
  tag: 'page-login',
  styleUrl: 'page-login.css'
})
export class PageLogin {
  @State()
  username = {
    valid: false,
    value: ''
  };

  @State()
  password = {
    valid: false,
    value: ''
  };

  @Prop({ connect: 'ion-nav' })
  nav: NavControllerBase;

  @Event() userDidLogin: EventEmitter;

  @State() hasError: boolean;

  async onLogin(ev) {
    ev.preventDefault();
    if (this.password.valid && this.username.valid) {
      await UserData.login(this.username.value);
      const nav = await (this.nav as any).componentOnReady();
      nav.push('page-tabs');
      this.userDidLogin.emit();
    } else {
      this.hasError = true;
    }
  }

  onSignup() {
    console.log('Clicked signup');
  }

  onUserNameInput(ev) {
    if (ev.target.value) {
      this.username = Object.assign({}, this.username, {
        valid: true,
        value: ev.target.value
      });
    } else {
      this.username = Object.assign({}, this.username, {
        valid: false,
        value: ''
      });
    }
    console.log(this.username);
  }

  onPasswordInput(ev) {
    if (ev.target.value) {
      this.password = Object.assign({}, this.password, {
        valid: true,
        value: ev.target.value
      });
    } else {
      this.password = Object.assign({}, this.password, {
        valid: false,
        value: ''
      });
    }
    console.log(this.password);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-menu-button />
          </ion-buttons>

          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>

        <form novalidate autocomplete="off">
          <ion-list no-lines>
            <ion-item>
              <ion-label stacked color="primary">
                Username
              </ion-label>
              <ion-input
                name="username"
                type="text"
                spellcheck={false}
                autocapitalize="off"
                required
                onInput={ev => this.onUserNameInput(ev)}
              />
            </ion-item>
            {!this.username.valid && this.hasError ? (
              <ion-text color="danger">
                <p padding-left>Username is required</p>
              </ion-text>
            ) : null}

            <ion-item>
              <ion-label stacked color="primary">
                Password
              </ion-label>
              <ion-input
                name="password"
                type="password"
                required
                onInput={ev => this.onPasswordInput(ev)}
              />
            </ion-item>

            {!this.password.valid && this.hasError ? (
              <ion-text color="danger">
                <p padding-left>Password is required</p>
              </ion-text>
            ) : null}
          </ion-list>

          <ion-row responsive-sm>
            <ion-col>
              <ion-button
                onClick={ev => this.onLogin(ev)}
                type="submit"
                expand="block"
              >
                Login
              </ion-button>
            </ion-col>
            <ion-col>
              <ion-button
                onClick={() => this.onSignup()}
                color="light"
                expand="block"
              >
                Signup
              </ion-button>
            </ion-col>
          </ion-row>
        </form>
      </ion-content>
    ];
  }
}
