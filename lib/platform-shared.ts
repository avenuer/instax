import { Datum, Paging2 } from './interface';

// CROSS-PLATFORM VALUES DONT IMPORT NATIVE MODULES OR FUNCTIONALTY

export enum WebSocketEvents {
  Connection = 'connection',
  InstagramLogin = 'instagram-login',
  SearchRequest = 'search-request',
  SearchResponse = 'search-response'
}

/** default location if location not provided */
export const NijaLocation: LocationQuery = {
  lat: 6.45407,
  long: 3.39467
};

export interface InstagramLogin {
  username: string;
  token: string;
}

export interface FBConfig {
  appId: string;
  version: string;
}

/** location format for query */
export interface LocationQuery {
  long: number;
  lat: number;
}

export type CleanedMedia = Datum & string;

export interface SearchQuery extends Partial<LocationQuery> {
  q: string;
}

export interface SearchQueryRequest extends SearchQuery {
  token?: string;
}

export interface SearchResponse {
  cleaned: Datum[];
  paging: Paging2;
}
