import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, NativeStorage } from 'ionic-native';

import { ChatMessage } from '../../models/chat-message';
import { ServiceChat } from '../../providers/service-chat';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  messages: any;
  zone: NgZone;
  chatBox: string;
  user: any;
  userReady: boolean = false;

  constructor(public navCtrl: NavController, public socket: ServiceChat, public ngzone: NgZone) {
    this.zone = ngzone;
    this.messages = [];
    this.chatBox = "";

    this.socket.socketService.subscribe(event => {
      switch (event.category) {
        case 'listMessages':
          this.zone.run(() => {
            this.messages = event.message;
          });
          break;
        case 'message':
          this.zone.run(() => {
            this.messages.push(event.message);
          });
          break;
      }
    });

  }



  ionViewCanEnter(): void {
    let env = this;
    NativeStorage.getItem('user')
    .then(data => {
      env.user = { name: data.name }
        env.userReady = true;
    }, error => {
      console.log(error);
    });
  }

  formatMessage(msg: string) {
    if (msg) {
      const data = new Date();
      const chatMessage: ChatMessage = {
        from: this.user.name,
        msg: msg,
        created: data
      };
      return chatMessage;
    }
    return null;
  }

  onInputKeypress(e) {
    if (e.keyCode === 13) {
      this.send(e.target.value);
    }
  }


  send(message) {
      const newMsg = this.formatMessage(message);
      if (newMsg) {
        this.socket.sendMessage(newMsg);
      }
      this.chatBox = '';
  }

  doFbLogout(): void {
    let nav = this.navCtrl;

    Facebook.logout()
      .then(response => {
        NativeStorage.remove('user');
        nav.push(LoginPage);
      }, error => {
        console.log(error);
      });
  }

}
