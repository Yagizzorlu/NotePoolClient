import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  activeSection: string = 'about';

  sections = [
    { id: 'about', title: 'Hakkımızda', icon: 'fa-info-circle' },
    { id: 'rules', title: 'Kurallar', icon: 'fa-gavel' },
    { id: 'privacy', title: 'Gizlilik Politikası', icon: 'fa-shield-halved' },
    { id: 'contact', title: 'İletişim', icon: 'fa-envelope' }
  ];

  private scrollTimeout: any;

  constructor() { }

  ngOnInit(): void {
    // URL'den section parametresini al
    const hash = window.location.hash.replace('#', '');
    if (hash && this.sections.some(s => s.id === hash)) {
      this.activeSection = hash;
      setTimeout(() => {
        this.scrollToSection(hash, false);
      }, 300);
    } else {
      this.updateActiveSection();
    }

    // Scroll spy için event listener
    this.setupScrollSpy();
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.updateActiveSection();
    }, 100);
  }

  private setupScrollSpy(): void {
    // Intersection Observer kullanarak daha performanslı scroll spy
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);

    // Tüm section'ları observe et
    this.sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });
  }

  private updateActiveSection(): void {
    const scrollPosition = window.pageYOffset + 150;
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      const element = document.getElementById(section.id);
      if (element) {
        const offsetTop = element.offsetTop;
        if (scrollPosition >= offsetTop) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  scrollToSection(sectionId: string, updateUrl: boolean = true): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Navbar yüksekliği için
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // URL'yi güncelle
      if (updateUrl) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  }
}

