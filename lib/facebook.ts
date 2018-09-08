import fetch from 'node-fetch';
import { Facebook } from 'fb';
import { FBMediaResponse, Datum } from './interface';
import { flatMapDeep, uniqBy } from 'lodash';
import {
  SearchResponse,
  SearchQuery,
  NijaLocation,
  CleanedMedia,
  CleanedImage
} from './platform-shared';

const fb = new Facebook({});

const fields = `name,rating_count,photos{ height,backdated_time_granularity,link,images,name}`;

function queryFactory(search: SearchQuery) {
  const lat = search.lat || NijaLocation.lat;
  const long = search.long || NijaLocation.long;
  return `search?type=place&fields=${fields}&center=${lat},${long}&q=${search.q ||
    'lagos'}`;
}

export function getAppToken() {
  // getting facebook security codes from env
  const APP_ID = process.env.FB_API_ID;
  const APP_SECRET = process.env.FB_APP_SECRET;
  // urls mappings
  const credits = `client_id=${APP_ID}&client_secret=${APP_SECRET}`;
  const redirect = `redirect_uri=https://hidden-sierra-77960.herokuapp.com`;
  const url = `https://graph.facebook.com/oauth/access_token?${credits}&grant_type=client_credentials&${redirect}`;
  return fetch(url).then(res => res.json());
}

/** loads more for faecbook graphql pagination */
export function loadNextCursor(query: string) {
  return fetch(query).then(res => res.json())
    .then(cleanResponse);
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
  let cleaned: CleanedImage[] = flatMapDeep(
    data
      .filter(media => media.photos)
      .map(({ photos, name }) =>  {
        const images =  flatMapDeep(photos.data.map(e => e.images || []));
        return images.map(e => Object.assign({ name }, e))[0];
      })
  );
  cleaned = uniqBy(cleaned, 'source');
  return { cleaned, paging };
}
