import {
  WebSocketEvents,
  InstagramLogin,
  SearchQuery,
  SearchQueryRequest
} from './platform-shared';
import memCache from './mem-cache';
import { logger } from './shared-instance';
import { fbSearch, getAppToken, loadNextCursor } from './facebook';

export default function realTime(io: SocketIO.Server) {
  logger.info(`mounting realtime connections to http server`);

  io.on(WebSocketEvents.Connection, socket => {
    // saving unique user into cache
    logger.info(`${socket.id} is connected`);
    memCache.addCache(socket.id, { user: 'Guest' });
    // listen for user login
    socket.on(WebSocketEvents.InstagramLogin, (data: InstagramLogin) => {
      logger.info(`${socket.id} is login realtime details`);
      memCache.addCache(socket.id, data);
    });

    // search query for users
    socket.on(
      WebSocketEvents.SearchRequest,
      async (sReq: SearchQueryRequest) => {
        // tslint:disable-next-line:prefer-const
        const req = await getAppToken();
        const { token, ...search } = sReq;
        const memoryToken = memCache.getUserById(socket.id).token;
        socket.emit(
          WebSocketEvents.SearchResponse,
          await fbSearch(search, token || memoryToken || req.access_token)
        );
      }
    );

    /** load next sets of images */
    socket.on(WebSocketEvents.NextCursor, async (cusor: string) => {
      socket.emit(WebSocketEvents.SearchResponse, await loadNextCursor(cusor));
    });
  });
}
