import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Dinamik yıl (Her yıl elle değiştirmekle uğraşma)
  currentYear: number = new Date().getFullYear();
}

