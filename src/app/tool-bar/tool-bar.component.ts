import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { exhaustMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {

  search: FormGroup;
  @Output() emitter = new EventEmitter();

  constructor(private fb: FormBuilder) {

   }

   setup() {
     this.search = this.fb.group({
       search: ['', '']
     });
   }

  ngOnInit() {
    this.setup();
    this.search.valueChanges
      .pipe(debounceTime(400))
      .subscribe(this.emitter.emit);
  }

}
