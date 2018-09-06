import { Facebook } from 'fb';
import { FBMediaResponse, Datum } from './interface';
import { flatMapDeep } from 'lodash';
import {
  SearchResponse,
  SearchQuery,
  NijaLocation,
  CleanedMedia
} from './platform-shared';

// getting facebook security codes from env
const APP_ID = process.env.FB_API_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
// fb options
const options = { appId: APP_ID, appSecret: APP_SECRET };

const fb = new Facebook(options);

const fields = `name,rating_count,photos{ height,backdated_time_granularity,link,images,name}`;

function queryFactory(search: SearchQuery) {
  const lat = search.lat || NijaLocation.lat;
  const long = search.long || NijaLocation.long;
  return `search?type=place&fields=${fields}&center=${lat},${long}&q=${search.q ||
    'lagos'}`;
}

export function getAppToken() {
  return new Promise((resolove, reject) => {
    const url = `oauth/access_token?client_id=${APP_ID}&client_secret${APP_SECRET}&grant_type=client_credentials`;
    fb.api(url, function(res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log(res);
    });
  });
}

/** performs search queries */
export function fbSearch(query: SearchQuery, token: string) {
  return new Promise<SearchResponse>(resolve => {
    fb.api(queryFactory(query), { access_token: token }, function(res) {
      resolve(cleanResponse(res));
    });
  });
}

/** cleans the query resonse */
function cleanResponse(response: FBMediaResponse): SearchResponse {
  const { data, paging } = response;
  const cleaned: Datum[] = flatMapDeep(
    data
      .filter(media => media.photos)
      .map(({ photos, name }) => Object.assign({ name }, photos.data))
  );
  return { cleaned, paging };
}
