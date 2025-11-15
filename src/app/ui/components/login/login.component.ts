import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userService : UserService, spinner : NgxSpinnerService) {
    super(spinner)
  }

  ngOnInit(): void {
  }

  async login(userNameOrEmail  : string, password : string) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.userService.login(userNameOrEmail,password, () => this.hideSpinner(SpinnerType.BallAtom));
  } 
}
