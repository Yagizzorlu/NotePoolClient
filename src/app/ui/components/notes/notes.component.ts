import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeAnimation } from '../../../shared/animations/fade.animation'; // Eğer yoksa aşağıda vereceğim

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [fadeAnimation] // Sayfa geçiş animasyonu
})
export class NotesComponent {
  // Burası bir 'Container' olduğu için ekstra logic barındırmamalı.
  // BaseComponent'ten türemesine ve manuel spinner açmasına gerek yok.
  
  // Route animasyonunu tetiklemek için yardımcı metod
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}