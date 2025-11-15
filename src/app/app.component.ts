import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
declare var $: any 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'NotePoolClient';
  navOpen = false;

  constructor() {  //private router: Router, private toastr: CustomToastrService (constructor içine)

  }    

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    const dropdown = (event.target as HTMLElement).closest('.dropdown-nav');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }

  ngOnInit(): void {

    // $.get('https://localhost:7111/api/notes',(data) => {
    //   console.log(data);
    // });
    // this.router.events
    //   .pipe(filter(e => e instanceof NavigationEnd), take(1))
    //   .subscribe(() => {
    //     this.toastr.message(
    //       'Welcome to NotePool',
    //       'Hello 👋',
    //       { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight, timeOut: 2000 } // 2000ms = 2s
    //     );
    //   });
  }
}


