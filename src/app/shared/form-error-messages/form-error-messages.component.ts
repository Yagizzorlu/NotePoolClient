import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error-messages',
  templateUrl: './form-error-messages.component.html',
  styleUrls: ['./form-error-messages.component.scss']
})
export class FormErrorMessagesComponent {
  
  // Doğrulanacak Form Control (Örn: form.get('email'))
  @Input() control: AbstractControl | null = null;
  
  // Alan Adı (Mesajda göstermek için: "Email zorunludur")
  @Input() fieldName: string = 'Bu alan';

  get errorMessage(): string | null {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return null;
    }

    const errors = this.control.errors;

    // Standart Validator Mesajları
    if (errors['required']) return `${this.fieldName} zorunludur.`;
    if (errors['email']) return `Geçerli bir e-posta adresi giriniz.`;
    if (errors['minlength']) return `${this.fieldName} en az ${errors['minlength'].requiredLength} karakter olmalıdır.`;
    if (errors['maxlength']) return `${this.fieldName} en fazla ${errors['maxlength'].requiredLength} karakter olabilir.`;
    
    // Özel Validatorlar (Custom)
    if (errors['notSame']) return `Şifreler eşleşmiyor.`;
    if (errors['pattern']) return `${this.fieldName} formatı geçersiz.`;
    
    // Backend'den gelen özel hatalar (Varsa)
    if (errors['serverError']) return errors['serverError'];

    return null;
  }
}


