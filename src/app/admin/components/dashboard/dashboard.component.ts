import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from './../../../base/base.component';
import { AlertifyService, Position, MessageType } from './../../../services/admin/alertify.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(private alertify : AlertifyService, spinner: NgxSpinnerService) {
    super(spinner)
  }

  ngOnInit(): void { 

  }

  // m(){
  // this.alertify.message("Giriş Yapıldı", MessageType.Success, Position.TopRight,10,true);
  // }

  // d(){
  //   this.alertify.dismiss();
  // }
}
