import { ListComponent } from './../notes/list/list.component';
import { HttpClientService } from './../../../services/common/http-client.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Create_Note } from '../../../contracts/create_note';

@Component({
  selector: 'app-notes-upload',
  templateUrl: './notes-upload.component.html',
  styleUrl: './notes-upload.component.scss'
})
export class NotesUploadComponent extends BaseComponent implements OnInit {

  constructor(spinner : NgxSpinnerService,private httpClientService : HttpClientService) {
    super(spinner)
  }

  ngOnInit(): void {
      
  }

  @ViewChild(ListComponent) listComponents : ListComponent
  createdNote(createdNote : Create_Note) {
    this.listComponents.getNotes();
  }
}
