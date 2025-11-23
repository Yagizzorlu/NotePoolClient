import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from './../../../base/base.component';
import { AlertifyService, Position, MessageType } from './../../../services/admin/alertify.service';
import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../../services/common/signalr.service';
import { HubUrls } from '../../../constants/hub-urls';
import { ReceiveFunctions } from '../../../constants/receive-functionts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(private alertify : AlertifyService, spinner: NgxSpinnerService, private signalRservice : SignalRService) {
    super(spinner)
    signalRservice.start(HubUrls.NoteHub)
    signalRservice.start(HubUrls.CommentHub)
  }

  ngOnInit(): void { 
    this.signalRservice.on(ReceiveFunctions.NoteCreatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.CommentAddedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.CommentDeletedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.CommentUpdatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.ReactionAddedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.ReactionDeletedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.BookmarkAddedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.BookmarkRemovedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.CourseCreatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.CourseUpdatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.DepartmentCreatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
    this.signalRservice.on(ReceiveFunctions.DepartmentUpdatedMessageReceiveFunction, message => {
      this.alertify.message(message, {
        messageType: MessageType.Notify,
        position : Position.TopRight,
        dismissOthers : true
      })
    })
  }

  // m(){
  // this.alertify.message("Giriş Yapıldı", MessageType.Success, Position.TopRight,10,true);
  // }

  // d(){
  //   this.alertify.dismiss();
  // }
}
