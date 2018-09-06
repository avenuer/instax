import { differenceInMinutes } from 'date-fns';
import { EventEmitter } from 'events';
import { logger } from './shared-instance';

/**
 * Shows the type and data format for the application stored
 *
 * @interface MemcaheItem
 */
interface MemcacheItem {
  user: string;
  time: number;
  token?: string;
}

interface Memcache {
  [key: string]: MemcacheItem;
}

/** Time Interval for application to clear cahce */
const CACHE_TIMEOUT = 1000 * 60 * 60 * 2;

enum MemcacheEvents {
  CacheAdded = 'CacheAdded',
  CacheRemove = 'CacheRemoved',
  ClearingCache = 'ClearingCache',
  CacheCleared = 'CacheCleared'
}

class InstaxMemCache extends EventEmitter {
  /**
   * application memory-store like memcache
   *
   * @private
   * @type {String[]}
   * @memberof InstaxMemCache
   */
  private memcache: Memcache = {};

  constructor() {
    super();
  }

  /**
   * clears the cache of no-recent logins to avoid high memory consumption
   *
   * @memberof InstaxMemCache
   */
  intervalCacheClearance() {
    setInterval(() => {}, CACHE_TIMEOUT);
  }

  /**
   * removes from the cache older logins greater than 1hr30mins
   *
   * @memberof InstaxMemCache
   */
  cacheClearer() {
    logger.info(`started clearing memcache`);
    this.emit(MemcacheEvents.ClearingCache);
    const currentDate = Date.now();
    Object.keys(this.memcache).forEach(cache => {
      const timeDiff = differenceInMinutes(
        currentDate,
        this.memcache[cache].time
      );
      if (timeDiff > 30) {
        delete this.memcache[cache];
      }
    });
    this.emit(MemcacheEvents.CacheCleared);
    logger.info(`finished clearing memcache`);
  }

  /**
   *
   *
   * @param {string} socketId uniqueId to identify the websocket connection
   * @param {*} username the username of login
   * @memberof InstaxMemCache
   */
  addCache(socketId: string, cache: Partial<MemcacheItem>) {
    logger.info(`added ${cache.user} :: ${socketId} to memcache`);
    this.memcache[socketId] = { time: Date.now(), ...this.memcache[socketId], ...cache };
    this.emit(MemcacheEvents.CacheAdded, { user: cache.user });
  }

  /**
   * gets the user uniqueId by username provided
   *
   * @param {string} userName
   * @returns
   * @memberof InstaxMemCache
   */
  getUserId(userName: string) {
    logger.info(`retriving ${userName} from memcache`);
    const keysArray = Object.keys(this.memcache);
    const index = keysArray.findIndex(
      cacheKey => this.memcache[cacheKey].user === userName
    );
    if (index < 0) {
      throw userNotFoundError;
    }
    return keysArray[index];
  }

  /**
   * retrieves the user cache object
   *
   * @param {string} userName
   * @returns
   * @memberof InstaxMemCache
   */
  getByUserName(userName: string) {
    return this.memcache[this.getUserId(userName)];
  }

  /**
   * returns cacheItem with userId
   *
   * @param {string} id
   * @returns
   * @memberof InstaxMemCache
   */
  getUserById(id: string) {
    logger.info(`retriving user ${id} from memcache`);
    const cache = this.memcache[id];
    if (typeof cache !== 'object') {
      throw userNotFoundError;
    }
    return cache;
  }

  /**
   * return the list of user-cache
   *
   * @returns
   * @memberof InstaxMemCache
   */
  allUserCaches() {
    logger.info(`retriving all caches from memcache`);
    return Object.values(this.memcache);
  }
}

const userNotFoundError = new Error(`user not found in the cache store`);

const cacheStore = new InstaxMemCache();

export default cacheStore;
