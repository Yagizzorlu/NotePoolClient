import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileDto } from '../../contracts/user-profile-dto';
import { AuthService } from '../../services/common/auth.service';
import { UserService } from '../../services/common/models/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  navOpen: boolean = false; // Mobil menü durumu
  userMenuOpen: boolean = false; // Avatar dropdown durumu
  isScrolled: boolean = false; // Navbar gölgesi için
  
  userProfile?: UserProfileDto;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Giriş durumunu dinle ve profil verisini çek
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.loadUserProfile();
      } else {
        this.userProfile = undefined;
      }
    });
  }

  async loadUserProfile() {
    try {
      this.userProfile = await this.userService.getMyProfile();
    } catch (error) {
      console.error("Profil yüklenemedi", error);
    }
  }

  // --- ACTIONS ---

  onSearch(term: string) {
    if (term.trim()) {
      this.router.navigate(['/notes'], { queryParams: { searchTerm: term } });
      this.closeNav();
    }
  }

  signOut() {
    this.authService.signOut();
    this.userMenuOpen = false;
    this.router.navigate(['/']);
  }

  // --- UI TOGGLES ---

  toggleNav() {
    this.navOpen = !this.navOpen;
    this.userMenuOpen = false; // Diğerini kapat
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    this.navOpen = false; // Mobili kapat
  }

  closeNav() {
    this.navOpen = false;
    this.userMenuOpen = false;
  }

  // --- LISTENERS ---

  // Scroll olunca navbar'a gölge ekle
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  // Dropdown dışına tıklayınca kapat
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.userMenuOpen = false;
    }
  }
}


