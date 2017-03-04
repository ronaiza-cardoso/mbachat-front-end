import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { ChatMessage } from '../models/chat-message';

@Injectable()
export class ServiceChat {
  socketObserver: any;
  socketService: any;
  socket: any;
  user: any;
  data: any = null;
  // socketHost: string = 'https://mba-chat.herokuapp.com/';
  socketHost: string = 'http://192.168.0.10:3000/';

  constructor() {
    this.socketService = Observable.create(observer => {
      this.socketObserver = observer;
    });
    this.initialize();
  }

  initialize(){
    this.socket = io(this.socketHost);

    this.socket.on('connect', msg => {
      console.log('on connect');
      this.socketObserver.next({ category: 'connect', message: 'user connected'});
    });

    this.socket.on('listMessages', msg => {
      this.socketObserver.next({ category: 'listMessages', message: msg });
    });

    this.socket.on('message', msg => {
      this.socketObserver.next({ category: 'message', message: msg });
    });

  }

  sendMessage(message: ChatMessage) {
    this.socket.emit('message', message);
    this.socketObserver.next({ category: 'sendMessage', message: message });
  }

}
