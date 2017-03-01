import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage } from 'ionic-native';

import { ChatPage } from './../pages/chat/chat';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = LoginPage ;
  constructor(platform: Platform) {
    platform.ready().then(() => {
      let env = this;

      NativeStorage.getItem('user')
        .then(data => {
          env.nav.push(ChatPage);
          Splashscreen.hide();
        }, error => {
          console.log(error)
          env.nav.push(LoginPage);
          Splashscreen.hide();

        });

      StatusBar.styleDefault();
    });
  }
}
