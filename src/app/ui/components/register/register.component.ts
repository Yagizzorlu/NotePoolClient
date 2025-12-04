import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { InstitutionDto } from '../../../contracts/institution-dto';
import { DepartmentDto } from '../../../contracts/department-dto';
import { UserService } from '../../../services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { GetAllInstitutionsResponse, InstitutionService } from '../../../services/common/models/institution.service';
import { DepartmentService, GetAllDepartmentsResponse } from '../../../services/common/models/department.service';
import { RegisterRequest } from '../../../contracts/register-request';
import { RegisterResponse } from '../../../contracts/register-response';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  frm!: FormGroup; // ! işareti ile initialize edileceğini belirtiyoruz
  submitted: boolean = false;

  // Listeler
  institutions: InstitutionDto[] = [];
  allDepartments: DepartmentDto[] = [];
  filteredDepartments: DepartmentDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService,
    private institutionService: InstitutionService,
    private departmentService: DepartmentService,
    spinner: NgxSpinnerService, // public yapmadım çünkü super() ile kullanıyoruz
    private router: Router
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.createForm();
    this.loadInstitutions();
    this.loadDepartments();

    // Kurum değişince bölümleri filtrele
    this.frm.get('institutionId')?.valueChanges.subscribe(institutionId => {
      this.filterDepartments(institutionId);
      this.frm.patchValue({ departmentId: '' }); // Bölüm seçimini sıfırla
    });
  }

  createForm() {
    this.frm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      userName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(70)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ["", Validators.required],
      institutionId: ["", Validators.required],
      departmentId: ["", Validators.required]
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get("password")?.value;
        let confirmPass = group.get("passwordConfirm")?.value;
        return pass === confirmPass ? null : { notSame: true };
      }
    });
  }

  // SENIOR TOUCH: Tip Güvenli Yükleme
  async loadInstitutions() {
    try {
      const response: GetAllInstitutionsResponse = await this.institutionService.getAllInstitutions(0, 1000); // Tümünü getir (Dropdown için)
      this.institutions = response.institutions || [];
    } catch (error) {
      // Hata zaten interceptor'da yakalanır
    }
  }

  async loadDepartments() {
    try {
      const response: GetAllDepartmentsResponse = await this.departmentService.getAllDepartments(0, 1000); // Tümünü getir
      this.allDepartments = response.departments || [];
      // Eğer formda zaten seçili bir kurum varsa (edit modu vs.) filtrele
      const currentInstId = this.frm.get('institutionId')?.value;
      if(currentInstId) this.filterDepartments(currentInstId);
    } catch (error) {
      // Hata yönetimi
    }
  }

  filterDepartments(institutionId: string) {
    if (institutionId) {
      this.filteredDepartments = this.allDepartments.filter(d => d.institutionId === institutionId);
    } else {
      this.filteredDepartments = [];
    }
  }

  // HTML'de kolay erişim için getter
  get f() {
    return this.frm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.frm.invalid) return;

    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    try {
      const request: RegisterRequest = this.frm.getRawValue() as RegisterRequest;
      
      const response: RegisterResponse = await this.userService.create(request);

      if (response.succeeded) {
        this.toastrService.message(response.message, "Kayıt Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });

        this.router.navigate(["/login"]);
      } else {
        this.toastrService.message(response.message, "Kayıt Başarısız", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }

    } catch (error) {
      // Hata interceptor'da işlenir.
    } finally {
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    }
  }
}