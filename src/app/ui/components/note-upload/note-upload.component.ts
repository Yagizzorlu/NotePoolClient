import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { CourseDto } from '../../../contracts/course-dto';
import { NoteService } from '../../../services/common/models/note.service';
import { CourseService } from '../../../services/common/models/course.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { CreateNoteRequest } from '../../../contracts/create_note-request';
import { UpdateNoteRequest } from '../../../contracts/update-note-request';


@Component({
  selector: 'app-note-upload',
  templateUrl: './note-upload.component.html',
  styleUrls: ['./note-upload.component.scss']
})
export class NoteUploadComponent extends BaseComponent implements OnInit {

  uploadForm!: FormGroup;
  courses: CourseDto[] = [];
  selectedFiles: File[] = [];
  
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  noteId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private courseService: CourseService,
    private toastr: CustomToastrService,
    private router: Router,
    private route: ActivatedRoute,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.loadCourses();
    
    // Edit mode kontrolü - courses yüklendikten sonra
    this.route.queryParams.subscribe(async params => {
      if (params['id']) {
        this.noteId = params['id'];
        this.isEditMode = true;
        await this.loadNoteForEdit(this.noteId);
      }
    });
  }

  createForm() {
    this.uploadForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      courseId: ['', [Validators.required]],
      tags: [''] // Virgülle ayrılmış string
    });
  }

  // Edit modunda courseId'yi required yapmamak için
  updateFormForEditMode() {
    if (this.isEditMode) {
      // courseId validators'ını kaldır
      const courseIdControl = this.uploadForm.get('courseId');
      if (courseIdControl) {
        courseIdControl.clearValidators();
        courseIdControl.updateValueAndValidity();
      }
    }
  }

  // HTML'den kolay erişim için
  get f() { return this.uploadForm.controls; }

  async loadCourses() {
    // Bölüme göre filtreleme yapılabilir ama şimdilik hepsini çekelim
    // İleride User'ın bölümüne göre otomatik filtre eklenebilir.
    try {
      const response = await this.courseService.getAllCourses(0, 1000); 
      this.courses = response.courses;
    } catch (error) {
      this.toastr.message("Ders listesi yüklenemedi.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    }
  }

  // FileUpload componentinden gelen event
  onFilesChanged(files: File[]) {
    this.selectedFiles = files;
  }

  async loadNoteForEdit(noteId: string) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    try {
      const note = await this.noteService.getById(noteId);
      
      // Edit modunda courseId'yi required yapmamak için
      this.updateFormForEditMode();
      
      // CourseId'yi courseName'e göre bul
      let courseId = '';
      if (note.courseName && this.courses.length > 0) {
        const foundCourse = this.courses.find(c => c.name === note.courseName);
        if (foundCourse) {
          courseId = foundCourse.id;
        }
      }
      
      // Formu doldur
      this.uploadForm.patchValue({
        title: note.title,
        description: note.description || '',
        courseId: courseId,
        tags: note.tags || ''
      });
      
      // Form'u dirty olarak işaretle ki değişiklik yapıldığında buton aktif olsun
      this.uploadForm.markAsPristine();
      
    } catch (error) {
      this.toastr.message("Not yüklenirken hata oluştu.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
      this.router.navigate(['/notes']);
    } finally {
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    }
  }

  async onSubmit() {
    if (this.uploadForm.invalid) return;
    
    if (this.isEditMode) {
      // Güncelleme modu - dosya zorunlu değil
      this.isSubmitting = true;
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

      try {
        const request: UpdateNoteRequest = {
          id: this.noteId!,
          title: this.uploadForm.value.title,
          description: this.uploadForm.value.description,
          tags: this.uploadForm.value.tags
        };
        
        await this.noteService.update(request);

        this.toastr.message("Not başarıyla güncellendi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight });
        
        // Detay sayfasına dön
        this.router.navigate(['/notes', this.noteId]);

      } catch (error: any) {
        // Hata interceptor'da
      } finally {
        this.isSubmitting = false;
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      }
    } else {
      // Yeni not oluşturma modu
      if (this.selectedFiles.length === 0) {
        this.toastr.message("En az bir PDF dosyası yüklemelisiniz.", "Uyarı", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomRight });
        return;
      }

      this.isSubmitting = true;
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

      try {
        const request: CreateNoteRequest = this.uploadForm.value;
        
        // Servis Çağrısı (Dosyalar ve Form Verisi)
        // UserId, InstitutionId vb. Backend'de Token'dan alınacak.
        await this.noteService.create(request, this.selectedFiles);

        this.toastr.message("Not başarıyla paylaşıldı.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight });
        
        // Listeye dön
        this.router.navigate(['/notes']);

      } catch (error: any) {
        // Hata mesajı interceptor veya catch içinde yakalanabilir
        // Burada özel bir şey yapmak istersen:
        // console.error(error);
      } finally {
        this.isSubmitting = false;
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      }
    }
  }
}

