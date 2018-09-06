import * as Router from 'koa-router';
import { Context } from 'koa';
import memcache from './mem-cache';
import { successFactory, failureFactory } from './api-formats';
import { logger } from './shared-instance';
import { FBConfig } from './platform-shared';

const router = new Router({ prefix: '/api' });

router.use((ctx, next) => {
  logger.debug(`router${ctx.url}`);
  ctx.type = 'application/json';
  next();
});

// retrieves all user connected
router.get('/users', (ctx: Context) => {
  ctx.response.body = successFactory(memcache.allUserCaches());
});

// retrive a particular User with Id
router.get('/users/:id', (ctx: Context) => {
  try {
    ctx.response.body = successFactory(memcache.getUserById(ctx.params.id));
  } catch (error) {
    ctx.response.body = failureFactory(error);
  }
});

// send facebook configuration required
router.get('/config/facebook', (ctx: Context) => {
  const config: FBConfig = {
    appId: process.env.FB_API_ID,
    version: process.env.FB_API_VERSION || 'v3.1'
  };
  ctx.response.body = successFactory(config);
});

router.get('/subscriptions', (ctx: Context) => {
  ctx.response.body = successFactory(memcache.allUserCaches());
});

router.use('/medias', (ctx: Context) => {
  const h = JSON.stringify(ctx.request.headers || {});
  const q = JSON.stringify(ctx.query || {});
  const b = JSON.stringify(ctx.body || {});
  ctx.response.body = successFactory({ h, q, b  });
});

export default router;
