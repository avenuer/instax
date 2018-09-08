import * as Koa from 'koa';
import * as socket from 'socket.io';
import * as http from 'http';
import * as path from 'path';

import * as serve from 'koa-static';
import * as compress from 'koa-compress';

import router from './routes';
import { logger } from './shared-instance';
import realTime from './websocket';

// development enviromental variables
const ENV  = process.env.NODE_ENV || 'development';
if (ENV === 'development') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

const app = new Koa();

// setup logger instance
app.use(async (ctx, next) => {
  await next();
  logger.info(`${ctx.method} ${ctx.url} - ${new Date()}`);
});

// compression
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

// serving static files
app.use(serve(path.join(__dirname, '..', 'dist', 'instAx')));

// mount route on the appilication
app.use(router.routes());

// static html_files
// app.use()

const server = http.createServer(app.callback());

// mount realtime specs
realTime(socket(server));

server.listen(PORT, () => {
  logger.info(`server started on port:${PORT}`);
});
