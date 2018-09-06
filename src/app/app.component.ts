import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { WebsocketService } from './providers/websocket.service';
import { FacebookService, NijaLocation } from './providers/facebook.service';
import { BehaviorSubject, of } from 'rxjs';
import { exhaustMap, skipWhile, tap } from 'rxjs/operators';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  search$ = new BehaviorSubject<string>(null);

  feed$ = of<any[]>([]);

  // listen to location changes
  enabledGps$ = new BehaviorSubject(false);
  // change location
  location$ = of(null);

  constructor(private ws: WebsocketService, private fb: FacebookService, private auth: AuthService) {

  }

  links(action: string) {
    console.log(action);
    switch (action) {
      case 'facebook-login':
      this.auth.signIn(FacebookLoginProvider.PROVIDER_ID, { scope: 'email, manage_pages' });
        return;
      case 'github':
        return;
      default:
        break;
    }
  }

  // listen for gps enablement
  location() {
    return this.enabledGps$.pipe(exhaustMap(isEnabled => {
      if (isEnabled) {
        return this.fb.getUserLocation();
      }
      return of(NijaLocation);
    }));
  }

  authState() {
    this.auth.authState
    .pipe(skipWhile((d) => !d), tap(console.log))
    .subscribe((state: SocialUser) => {
      this.ws.login({ token: state.authToken, username: state.email });
      this.fb.img = of(state.photoUrl);
    });
  }

  ngOnInit() {
    this.location$ = this.location();
    this.feed$ = this.search$.pipe(exhaustMap((q) => this.fb.search(q || '', this.location$)));
    this.authState();
  }
}
