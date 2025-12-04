import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileDto } from '../../contracts/user-profile-dto';
import { AuthService } from '../../services/common/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  @Input() user: UserProfileDto | null = null;

  isOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {}

  toggleMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  signOut() {
    this.authService.signOut();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  // Click Outside (Dışarı tıklayınca kapat)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Eğer menü açıksa ve tıklanan yer menünün içinde DEĞİLSE kapat
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}


