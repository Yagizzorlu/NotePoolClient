import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { HttpClientService } from '../../../services/common/http-client.service';
import { Create_Note } from '../../../contracts/create_note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private httpClientService : HttpClientService) {
    super(spinner);
  }

 ngOnInit(): void {
  this.showSpinner(SpinnerType.BallAtom);

  // GET - notları listele
  this.httpClientService.get<Create_Note[]>({
    controller: "notes"
  }).subscribe(data => console.log(data));

  // POST - yeni not ekle
  // this.httpClientService.post({
  //   controller: "notes"
  // }, {
  //   title: "Mimari",
  //   description: "final",
  //   tags: "microcycle",
  //   courseId: "f38e10d2-a74c-4cb7-ba15-2d708dc89699",      // 🔹 Courses tablosundaki geçerli Id
  //   institutionId: "ead57062-490e-4769-9e67-f37fe2ff374b", // 🔹 Institutions tablosundaki geçerli Id
  //   userId: "d91b554a-d603-4055-9590-cfd6a8305456"         // 🔹 Users tablosundaki geçerli Id
  // }).subscribe();

  // this.httpClientService.put ({
  //   controller : "notes",
  // }, {
  //   id : "019a1bff-5afc-7ed0-8f28-92c023d72275",
  //   title : "Mimari v2",
  //   description : "büt",
  //   tags : "Alu",
  //   courseId: "f38e10d2-a74c-4cb7-ba15-2d708dc89699",  
  //   institutionId: "ead57062-490e-4769-9e67-f37fe2ff374b", 
  //   userId: "d91b554a-d603-4055-9590-cfd6a8305456" 
  // }).subscribe();

  // this.httpClientService.delete({
  //   controller: "notes"
  // }, "019a1c04-a991-7822-9c56-24d22236f338").subscribe();
  // }
  }
}
