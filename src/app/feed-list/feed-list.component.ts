import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CleanedImage } from 'lib/platform-shared';
import { debounce, debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent implements OnInit {

  @Input() feed: CleanedImage[] = [];

  loadMore$ = new BehaviorSubject<CleanedImage[]>([]);

  @Output() emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.loadMore$.pipe(
      debounceTime(300),
    )
      .subscribe((e) => this.emitter.emit(e));
  }

}
