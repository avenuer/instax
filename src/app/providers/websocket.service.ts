import { Injectable } from '@angular/core';
import { InstagramLogin, WebSocketEvents, SearchResponse, SearchQueryRequest, SearchQuery, CleanedImage } from 'lib/platform-shared';
import { BehaviorSubject } from 'rxjs';
import { Paging2 } from 'lib/interface';

declare const io;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private previousSearch: SearchQuery;
  private sameSearch = false;

  private cursor: Paging2;

  /** observable stream for websocket events */
  realTimeEvent = new BehaviorSubject<CleanedImage[]>([]);

  loading = true;

  /** setup websocket connection to the server */
  private socket = io.call(window, ['/']);

  constructor() {
    this.realTimeInit();
    console.log(this.socket, this.realTimeEvent);
  }

  /**
   * Logins the data throw websocket to the server
   *
   * @param {InstagramLogin} data
   * @memberof WebsocketService
   */
  login(data: InstagramLogin) {
    this.loading = true;
    this.socket.emit(WebSocketEvents.InstagramLogin, data);
  }

  // emit a realtime search query
  search(search: SearchQueryRequest) {
    this.loading = true;
    this.sameSearch = search === this.previousSearch;
    this.socket.emit(WebSocketEvents.SearchRequest, search);
  }

  // loads next cursor for the applications
  loadMore() {
    this.loading = true;
    this.sameSearch = true;
    this.socket.emit(WebSocketEvents.NextCursor, this.cursor.next);
  }

  /** listen to realtime events */
  realTimeInit() {
    this.socket.on(WebSocketEvents.SearchResponse, (data: SearchResponse) => {
      this.loading = false;
      this.cursor = data.paging;
      if (this.sameSearch) {
        this.realTimeEvent.next(this.realTimeEvent.getValue().concat(data.cleaned));
        return;
      }
      this.realTimeEvent.next(data.cleaned);
    });
  }
}
