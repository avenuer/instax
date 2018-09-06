import { Injectable } from '@angular/core';
import { InstagramLogin, WebSocketEvents } from 'lib/platform-shared';
import { BehaviorSubject } from 'rxjs';

declare const io;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  /** observable stream for websocket events */
  realTimeEvent = new BehaviorSubject<InstagramLogin>(null);

  /** setup websocket connection to the server */
  private socket = io.call(window, ['/']);

  constructor() {
    this.realTimeInit();
    console.log(this.socket);
  }

  /**
   * Logins the data throw websocket to the server
   *
   * @param {InstagramLogin} data
   * @memberof WebsocketService
   */
  login(data: InstagramLogin) {
    this.socket.emit(WebSocketEvents.InstagramLogin, data);
  }

  /** listen to realtime events */
  realTimeInit() {
    this.socket.on(WebSocketEvents.RealTimeStarts, (data: InstagramLogin) => {
      this.realTimeEvent.next(data);
    });
  }
}
