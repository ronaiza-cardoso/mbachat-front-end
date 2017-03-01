import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Facebook, NativeStorage } from 'ionic-native';

import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
   FB_APP_ID: number = 253413051773935;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    Facebook.browserInit(this.FB_APP_ID, 'v2.8');
  }

  doFbLogin() {
    let permissions = new Array();
    const nav = this.navCtrl;

    permissions = ['public_profile'];

    Facebook.login(permissions)
      .then(response => {
        let userId = response.authResponse.userID;
        let params = new Array();

        Facebook.api('/me?fields=name', params)
          .then(user => {

            NativeStorage.setItem('user',
            { name: user.name })
            .then(() => {
              nav.push(ChatPage);
            }, error => {
              console.log(error);
            })

          })
      }, error => {
        console.log(error);
      });

  }
}
