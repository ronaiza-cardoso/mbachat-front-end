import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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
  socketHost: string = 'https://mba-chat.herokuapp.com/';

  constructor() {
    this.socketService = Observable.create(observer => {
      this.socketObserver = observer;
    });
    this.initialize();
  }

  initialize(){
    this.socket = io(this.socketHost);

    this.socket.on('connect', (msg) => {
      console.log('on connect');
      this.socketObserver.next({ category: 'connect', message: 'user connected'});
    });

    this.socket.on('reconnecting', (msg) => {
      console.log('on reconnecting');
    });

    this.socket.on('reconnect_error', (msg) => {
      console.log('on reconnect_error');
    });

    this.socket.on('reconnect_failed', (msg) => {
      console.log('on reconnect_failed');
    });

     this.socket.on('disconnect', () => {
      console.log('user disconnected');
      // io.emit('user disconnected');
    });

    this.socket.on('message', (msg) => {
      this.socketObserver.next({ category: 'message', message: msg });
    }); //end of socket.on('message')

  }

  sendMessage(message: ChatMessage) {
    this.socket.emit('message', message);
    this.socketObserver.next({ category: 'sendMessage', message: message });
  }

}
