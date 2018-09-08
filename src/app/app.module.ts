import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule,
   MatFormFieldModule, MatInputModule, MatCardModule,
    MatGridListModule, MatProgressSpinnerModule } from '@angular/material';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


import { AppComponent } from './app.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { FeedListComponent } from './feed-list/feed-list.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { WebsocketService } from './providers/websocket.service';
import { HttpClientModule } from '@angular/common/http';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('Facebook-App-Id')
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
   declarations: [
      AppComponent,
      ToolBarComponent,
      FeedListComponent,
      FeedItemComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      HttpClientModule,
      InfiniteScrollModule,
      SocialLoginModule,
      MatToolbarModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatGridListModule,
      MatProgressSpinnerModule
   ],
   providers: [WebsocketService, { useFactory: provideConfig, provide: AuthServiceConfig }],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
