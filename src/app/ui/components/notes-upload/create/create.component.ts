import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NoteService } from '../../../../services/common/models/note.service';
import { Create_Note } from '../../../../contracts/create_note';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { CourseService } from '../../../../services/common/models/course.service';

// 1. Angular Material Dialog servisini import et
import { MatDialog } from '@angular/material/dialog';

// 2. Kendi dialog component'ini ve enum'unu import et
// ❗ DİKKAT: Bu yolun doğruluğunu kendi projenize göre kontrol edin!
import { FileUploadDialogComponent, FileUploadDialogState } from '../../../../dialogs/file-upload-dialog/file-upload-dialog.component';

type CourseVM = { id: string; name: string; departmentId?: string };

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private noteService: NoteService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
    private courseService: CourseService
  ) { super(spinner); }

  courses: CourseVM[] = [];
  selectedCourseId: string = '';
  userData: { userName?: string; email?: string; institutionId?: string; departmentId?: string; userId?: string } | null = null;

  // TODO: Token sistemi geldiğinde bu hardcoded değerleri kaldır
  // Şimdilik test için geçici değerler
  private readonly TEMP_USER_ID = 'a1b47126-ecd2-4293-809e-5988fcd49d63';
  private readonly TEMP_INSTITUTION_ID = '019a6e09-08f9-709d-bd8f-5d0971bed577';
  private readonly TEMP_DEPARTMENT_ID = '019a6e97-5b36-71a0-9172-a0dc47f69126';

  ngOnInit(): void {
    // localStorage'dan kullanıcı bilgilerini al
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        this.userData = JSON.parse(userDataStr);
      } catch (e) {
        console.error('Kullanıcı bilgileri parse edilemedi:', e);
      }
    }

    // Eğer localStorage'da yoksa, test için hardcoded değerleri kullan
    if (!this.userData) {
      this.userData = {
        userId: this.TEMP_USER_ID,
        institutionId: this.TEMP_INSTITUTION_ID,
        departmentId: this.TEMP_DEPARTMENT_ID
      };
    }

    // Course listesini yükle
    this.courseService.getCourses().subscribe({
      next: (data: CourseVM[]) => {
        this.courses = data ?? [];
      },
      error: (error) => {
        this.alertify.message('Dersler yüklenirken bir hata oluştu', {
          dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
        });
      }
    });
  }

  /**
   * Standart <input type="file"> tarafından seçilen dosyaları tutar.
   */
  selectedFiles: File[] = [];
  
  /**
   * Standart <input type="file"> elementinin (change) event'ini yakalar.
   */
  onFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFiles = Array.from(input.files ?? []);
  }

  /**
   * Not başarıyla oluşturulduğunda tetiklenir.
   */
  @Output() createdNote: EventEmitter<Create_Note> = new EventEmitter();

  /**
   * Formu ve dosya input'unu temizlemek için kullanılan yardımcı metot.
   */
  clearForm(
    title: HTMLInputElement, 
    description: HTMLTextAreaElement, 
    tags: HTMLInputElement, 
    fileInput: HTMLInputElement
  ) {
    title.value = '';
    description.value = '';
    tags.value = '';
    this.selectedCourseId = '';
    this.selectedFiles = [];
    if (fileInput) {
      fileInput.value = ''; // Input'un içindeki seçimi sıfırlar
    }
  }

  /**
   * "Create Note" butonuna tıklandığında çalışan ana metot.
   */
  create(
    title: HTMLInputElement, 
    description: HTMLTextAreaElement, 
    tags: HTMLInputElement,
    fileInput: HTMLInputElement // HTML'den #fileInput referansı
  ) {
    
    // 1. Validasyonlar
    if (!title.value?.trim()) {
      this.alertify.message('Not Adı Giriniz', {
        dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
      });
      return;
    }
    if (description.value.length > 150) {
      this.alertify.message('Açıklama 150 karakteri geçmesin', {
        dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
      });
      return;
    }
    if (!this.selectedCourseId) {
      this.alertify.message('Lütfen bir ders seçiniz', {
        dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
      });
      return;
    }
    if (this.selectedFiles.length === 0) {
      this.alertify.message('En az bir PDF seçmelisiniz', {
        dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
      });
      return;
    }
    // Test için hardcoded değerler varsa onları kullan
    const institutionId = this.userData?.institutionId || this.TEMP_INSTITUTION_ID;
    const departmentId = this.userData?.departmentId || this.TEMP_DEPARTMENT_ID;
    const userId = this.userData?.userId || this.userData?.userName || this.TEMP_USER_ID;

    if (!institutionId || !departmentId || !userId) {
      this.alertify.message('Kullanıcı bilgileri bulunamadı. Lütfen component içindeki TEMP_* değerlerini doldurun veya kayıt olun.', {
        dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
      });
      return;
    }

    // --- 4. DIALOG AÇMA KISMI (GÜNCELLENDİ) ---
    // Yüklemeden önce senin dialog component'ini aç
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '450px', // Veya istediğiniz bir genişlik
      // Senin dialog component'ine (FileUploadDialogComponent)
      // "Evet" butonuna basıldığında geri dönmesi için
      // FileUploadDialogState.Yes değerini data olarak gönderiyoruz.
      data: FileUploadDialogState.Yes 
    });

    // Dialog kapandıktan sonra sonuca (result) bak
    dialogRef.afterClosed().subscribe(result => {
      
      // 5. Eğer kullanıcı "Evet" dediyse (yani result, gönderdiğimiz Yes ise)
      if (result === FileUploadDialogState.Yes) {
        
        // --- Burası dialog'dan önce yaptığımız yükleme işleminin aynısı ---
        this.showSpinner(SpinnerType.BallAtom);

        const create_note: Create_Note = new Create_Note();
        create_note.title = title.value;
        create_note.description = description.value;
        create_note.tags = tags.value;
        create_note.courseId = this.selectedCourseId;
        
        // Test için hardcoded değerler varsa onları kullan, yoksa localStorage'dan al
        create_note.institutionId = this.userData?.institutionId || this.TEMP_INSTITUTION_ID;
        create_note.departmentId = this.userData?.departmentId || this.TEMP_DEPARTMENT_ID;
        create_note.userId = this.userData?.userId || this.userData?.userName || this.TEMP_USER_ID;

        this.noteService.createWithPdf(
          create_note,
          this.selectedFiles,
          () => {
            // Başarı Durumu
            this.hideSpinner(SpinnerType.BallAtom);
            this.alertify.message('Not + PDF yüklendi', {
              dismissOthers: true, messageType: MessageType.Success, position: Position.TopRight
            });
            
            this.createdNote.emit(create_note);
            this.clearForm(title, description, tags, fileInput);
          },
          (errorMessage) => {
            // Hata Durumu
            this.hideSpinner(SpinnerType.BallAtom);
            this.alertify.message(errorMessage, {
              dismissOthers: true, messageType: MessageType.Error, position: Position.TopRight
            });
          }
        );
        // --- Yükleme işlemi sonu ---
      }
      // Kullanıcı "İptal" (veya dışarı) tıklarsa (result = undefined veya No olur)
      // hiçbir şey yapma.
    });
  }
}