import { BaseComponent, SpinnerType } from './../../../base/base.component';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { Create_User } from '../../../contracts/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { InstitutionService } from '../../../services/common/models/institution.service';
import { DepartmentService } from '../../../services/common/models/department.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'; // 1. Router eklendi

type InstitutionVM = {id : string; name : string};
type DepartmentVM = {id : string; name : string; institutionId : string};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent extends BaseComponent implements OnInit {
  
  // 2. Constructor'a router eklendi
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private toastrService: CustomToastrService, 
    private institutionService: InstitutionService, 
    private departmentService: DepartmentService, 
    spinner: NgxSpinnerService,
    private router: Router 
  ) {
      super(spinner)
  }

  frm: FormGroup;

  institutions: InstitutionVM[] = [];
  allDepartments: DepartmentVM[] = [];
  filteredDepartments: DepartmentVM[] = [];

  ngOnInit(): void {

    this.institutionService.getInstitutions().subscribe({
      next: (data: InstitutionVM[]) => {
        this.institutions = data ?? [];
      },
      error: (error) => {
        this.toastrService.message('Üniversiteler yüklenirken bir hata oluştu', 'Hata', {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    });

    this.departmentService.getDepartments().subscribe({
      next: (data: DepartmentVM[]) => {
        this.allDepartments = data ?? [];
        this.filterDepartments();
      },
      error: (error) => {
        this.toastrService.message('Bölümler yüklenirken bir hata oluştu', 'Hata', {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    });

      this.frm = this.formBuilder.group({
        firstName : ["", [Validators.required, Validators.maxLength(50),Validators.minLength(3)]],
        lastName : ["", [Validators.required, Validators.maxLength(50),Validators.minLength(3)]],
        userName: ["",[Validators.required, Validators.maxLength(50),Validators.minLength(3)]],
        email : ["",[Validators.required, Validators.maxLength(70),Validators.email]],
        password : ["",Validators.required],
        passwordConfirm : ["",Validators.required],
        institutionId : ["", Validators.required],
        departmentId : ["", Validators.required]

  }, {
    validators : (group : AbstractControl) : ValidationErrors | null => {
      let sifre = group.get("password").value;
      let sifreTekrar = group.get("passwordConfirm").value;
      return sifre === sifreTekrar ? null : {notSame:true};
    }
  });

    // Üniversite değiştiğinde bölümleri filtrele
    this.frm.get('institutionId')?.valueChanges.subscribe(institutionId => {
      this.filterDepartments();
      // Üniversite değiştiğinde seçili bölümü sıfırla
      this.frm.patchValue({ departmentId: '' });
    });
  }

  filterDepartments() {
    const selectedInstitutionId = this.frm.get('institutionId')?.value;
    if (selectedInstitutionId) {
      this.filteredDepartments = this.allDepartments.filter(dept => dept.institutionId === selectedInstitutionId);
    } else {
      this.filteredDepartments = [];
    }
  }

  get component() {
    return this.frm.controls;
  }

  submitted : boolean = false;

  async onSubmit() {
    this.submitted = true;

    if(this.frm.invalid) {
      return;
    }

    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    try {
      const user : User = this.frm.getRawValue() as User;

      const result : Create_User = await this.userService.create(user);
      
      if(result.succeeded) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userData = {
          userName: user.userName,
          email: user.email,
          institutionId: user.institutionId,
          departmentId: user.departmentId
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı", {
          messageType : ToastrMessageType.Success,
          position : ToastrPosition.TopRight
        });
        
        this.frm.reset();
        this.submitted = false;

        // 3. Başarılı işlem sonrası Login sayfasına yönlendirme
        this.router.navigate(["/login"]); 

      } else {
        this.toastrService.message(result.message, "Kullanıcı Kaydı Başarısız", {
          messageType : ToastrMessageType.Error,
          position : ToastrPosition.TopRight
        });
      }
    } catch (error: any) {
      let errorMessage = "Kullanıcı kaydı sırasında bir hata oluştu.";
      
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 404) {
        errorMessage = "API endpoint'i bulunamadı. Lütfen backend servisinin çalıştığından emin olun.";
      } else if (error?.status === 400) {
        errorMessage = "Geçersiz istek. Lütfen bilgilerinizi kontrol edin.";
      } else if (error?.status === 500) {
        errorMessage = "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
      }

      this.toastrService.message(errorMessage, "Kullanıcı Kaydı Başarısız", {
        messageType : ToastrMessageType.Error,
        position : ToastrPosition.TopRight
      });
    } finally {
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    }
  }
}