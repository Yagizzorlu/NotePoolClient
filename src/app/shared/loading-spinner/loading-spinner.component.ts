import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-wrapper">
      <div class="spinner" [ngStyle]="{'width': size, 'height': size, 'border-width': thickness}"></div>
      <p *ngIf="text" class="spinner-text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px;
    }
    .spinner {
      border-style: solid;
      border-color: #f3f3f3; /* Light grey */
      border-top-color: #667eea; /* Primary Color (Senin tema rengin) */
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .spinner-text {
      color: #718096;
      font-size: 0.9rem;
      font-weight: 500;
      margin: 0;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: string = '40px'; // Varsayılan boyut
  @Input() thickness: string = '4px'; // Çizgi kalınlığı
  @Input() text?: string; // Opsiyonel alt yazı
}