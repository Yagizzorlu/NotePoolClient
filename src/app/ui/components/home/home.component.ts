import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../../../services/common/models/note.service';
import { NoteListDto } from '../../../contracts/note-list-dto';
import { AuthService } from '../../../services/common/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  latestNotes: NoteListDto[] = [];
  isLoading: boolean = true;
  private scrollObserver: IntersectionObserver | null = null;

  constructor(
    public authService: AuthService, // HTML'de kullanacağız
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedNotes();
    this.init3DTilt();
  }

  ngOnDestroy(): void {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }


  private init3DTilt(): void {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = element.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        (element as HTMLElement).style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(0)
        `;
      });

      element.addEventListener('mouseleave', () => {
        (element as HTMLElement).style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  async loadFeaturedNotes() {
    try {
      this.isLoading = true;
      // Sadece ilk 4 notu (Vitrini) çekiyoruz.
      // Sıralama (SortBy) eklenebilir: 'ViewCount' veya 'CreatedDate'
      const response = await this.noteService.getAll(0, 4, { sortBy: 'CreatedDate' });
      this.latestNotes = response.notes;
    } catch (error) {
      console.error("Vitrin notları yüklenemedi", error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch(term: string) {
    if (term.trim()) {
      this.router.navigate(['/notes'], { queryParams: { searchTerm: term } });
    }
  }

  goToAllNotes() {
    this.router.navigate(['/notes']);
  }
}

