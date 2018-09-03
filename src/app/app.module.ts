import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatGridListModule  } from '@angular/material';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedListComponent } from './feed-list/feed-list.component';
import { FeedItemComponent } from './feed-item/feed-item.component';


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
      MatToolbarModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatGridListModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
