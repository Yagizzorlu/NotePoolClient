import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { NoteService } from '../../../services/common/models/note.service';
import { UserService } from '../../../services/common/models/user.service';

// Arama Sonucu Tipleri
interface SearchResult {
  type: 'user' | 'note';
  id: string;
  title: string;        // User için: Ad Soyad, Note için: Başlık
  subtitle: string;     // User için: @username, Note için: Ders Adı
  image?: string;       // Avatar veya İkon
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm = new Subject<string>();
  results: SearchResult[] = [];
  isLoading: boolean = false;
  showDropdown: boolean = false;
  hasSearched: boolean = false;

  // 1. Backend Adresi (Resimler için gerekli)
  private readonly baseApiUrl = "https://localhost:7111/";

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  get hasUsersInResults(): boolean {
    return this.results.some(r => r.type === 'user');
  }

  ngOnInit(): void {
    // Reactive Search Logic
    this.searchTerm.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(term => {
        if (!term || term.length < 2) {
          this.showDropdown = false;
          return of([]); 
        }
        this.isLoading = true;
        this.showDropdown = true;
        this.hasSearched = true;
        
        return this.performSearch(term);
      })
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.results = [];
      }
    });
  }

  // 2. Resim yolunu düzelten yardımcı fonksiyon (HTML'de kullanacağız)
  createImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return "";
    
    // Eğer zaten tam link geliyorsa (Google fotosu vs.) elleme
    if (imagePath.startsWith("http")) return imagePath;

    // Başındaki / işaretini temizle
    let cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    
    // Backend adresini başına ekle
    return `${this.baseApiUrl}${cleanPath}`;
  }

  private async performSearch(term: string): Promise<SearchResult[]> {
    try {
      const [usersRes, notesRes] = await Promise.all([
        this.userService.getAllUsers(0, 5, term),
        this.noteService.getAll(0, 5, { searchTerm: term }) 
      ]);

      const userResults: SearchResult[] = (usersRes.users || []).map(u => ({
        type: 'user',
        id: u.id,
        title: u.fullName,
        subtitle: `@${u.userName}`,
        image: u.profileImage 
      }));

      const noteResults: SearchResult[] = (notesRes.notes || []).map(n => ({
        type: 'note',
        id: n.id,
        title: n.title,
        subtitle: n.courseName || 'Genel',
        image: undefined 
      }));

      return [...userResults, ...noteResults];

    } catch (error) {
      return [];
    }
  }

  onSearch(event: any) {
    this.searchTerm.next(event.target.value);
  }

  selectResult(result: SearchResult) {
    this.showDropdown = false;
    this.searchInput.nativeElement.value = '';
    
    if (result.type === 'user') {
      this.router.navigate(['/profile', result.id]);
    } else {
      this.router.navigate(['/notes', result.id]);
    }
  }

  searchAll() {
    const term = this.searchInput.nativeElement.value;
    if (term) {
      this.showDropdown = false;
      this.router.navigate(['/notes'], { queryParams: { searchTerm: term } });
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}