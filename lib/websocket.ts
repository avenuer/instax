import { WebSocketEvents, InstagramLogin, SearchQuery, SearchQueryRequest } from './platform-shared';
import memCache from './mem-cache';
import { logger } from './shared-instance';
import { fbSearch } from './facebook';

export default function realTime(io: SocketIO.Server) {
  logger.info(`mounting realtime connections to http server`);

  io.on(WebSocketEvents.Connection, (socket) => {
    logger.info(`${socket.id} is connected`);
    memCache.addCache(socket.id, { user: 'Guest' });
    socket.on(WebSocketEvents.InstagramLogin, (data: InstagramLogin) => {
      logger.info(`${socket.id} is login realtime details`);
      memCache.addCache(socket.id, data);
    });
    socket.on(WebSocketEvents.SearchRequest, async (req: SearchQueryRequest) => {
      const { token, ...search } = req;
      socket.emit(WebSocketEvents.SearchResponse, await fbSearch(search, token));
    });
  });

}
