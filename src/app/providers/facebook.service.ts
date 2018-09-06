import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, of, Observable } from 'rxjs';
import {
  catchError,
  map,
  exhaustMap,
  first,
  delay,
  skipWhile,
  tap
} from 'rxjs/operators';
import { FBMediaResponse } from 'lib/interface';
import { ApiResponse } from 'lib/api-formats';
import { FBConfig, LocationQuery } from 'lib/platform-shared';
import { WebsocketService } from './websocket.service';

/** restrict search to this fields */
const SEARCH_CATEGORIES = [
  'ARTS_ENTERTAINMENT',
  'EDUCATION',
  'FITNESS_RECREATION',
  'FOOD_BEVERAGE',
  'SHOPPING_RETAIL',
  'TRAVEL_TRANSPORTATION'
];

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  img = of<string>(null);

  constructor(private http: HttpClient, private ws: WebsocketService) {
    this.initFaceBook();
  }

  /** initialize the facebook setup */
  initFaceBook() {
    this.http
      .get<ApiResponse<FBConfig>>('/api/config/facebook')
      .pipe(
        skipWhile(() => (window as any).FB),
        first(),
        map(e => e.data),
        delay(1000)
      )
      .subscribe(config => {
        (window as any).FB.init(config);
        this.confirmLogin();
      });
  }

  /** checks if the user, has login before */
  confirmLogin() {
    from(this.getStatusLogin())
      .pipe(
        exhaustMap(user =>
          from(this.getUserByFBId(user.id)).pipe(
            map(bio => Object.assign({}, user, bio))
          )
        ),
        tap(console.log)
      )
      .subscribe(res => {
        this.img = of(res.img);
        this.ws.login({ username: res.email, token: res.token });
      });
  }

  /** gets the user by facebook Id */
  getUserByFBId(uid: string) {
    return new Promise<{
      id: string;
      name: string;
      email: string;
      img: string;
    }>((resolve, reject) => {
      FB.api(`/${uid}`, { fields: ['name', 'email', 'picture'] }, function(
        res
      ) {
        if (!res.id) {
          return reject(new Error('user with id not found'));
        }
        const { id, name, email } = res;
        const img = res.picture.data.url;
        return resolve({ id, name, email, img });
      });
    });
  }

  /** gets the current user login status */
  getStatusLogin() {
    return new Promise<{ id: string; token: string }>((resolve, reject) => {
      FB.getLoginStatus(response => {
        if (response.status !== 'connected') {
          return reject(new Error('user has not login or login expired'));
        }
        const id = response.authResponse.userID;
        const token = response.authResponse.accessToken;
        return resolve({ id, token });
      });
    });
  }

  /** query to search facebook graphql with location in mind*/
  search(
    query: string,
    location: Observable<LocationQuery> = of(NijaLocation)
  ) {
    let stream: Observable<FBMediaResponse>;
    if (location) {
      stream = location.pipe(exhaustMap(loc => this.fbSearch(query, loc)));
    } else {
      stream = this.fbSearch(query, NijaLocation);
    }
    return stream.pipe(map(this.cleanResponse));
  }

  /** cleans the respone to a meanful data */
  cleanResponse(response: FBMediaResponse) {
    const { data, paging } = response;
    const cleanData: CleanedMedia[] = data.map(({ id, name, picture }) => {
      const { url } = picture.data;
      return { id, name, url };
    });
    return { data: cleanData, paging };
  }

  fbSearch(query, location: LocationQuery) {
    return from(
      new Promise<FBMediaResponse>(resolve => {
        FB.api(
          `/search?type=place&q=lagos`,
          { fields: ['name', 'picture'] },
          function(res) {
            resolve(res);
          }
        );
      })
    );
  }

  /** retrieve the uses current location i.e for search */
  getUserLocation() {
    return from(this.navigatorWrapper()).pipe(
      map(loc => {
        return {
          lat: loc.coords.latitude,
          long: loc.coords.longitude
        } as LocationQuery;
      })
    );
  }

  /** wrapper geolocation call to promise based call */
  navigatorWrapper(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
      reject(new Error(`this browser doesn't support geolocation`));
    });
  }
}
