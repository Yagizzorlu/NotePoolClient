import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InstitutionDto } from '../../../../contracts/institution-dto';
import { DepartmentDto } from '../../../../contracts/department-dto';
import { CourseDto } from '../../../../contracts/course-dto';
import { InstitutionService } from '../../../../services/common/models/institution.service';
import { DepartmentService } from '../../../../services/common/models/department.service';
import { CourseService } from '../../../../services/common/models/course.service';

// Filtre Çıktısı (Parent'a gönderilecek veri)
export interface FilterState {
  institutionId?: string;
  departmentId?: string;
  courseId?: string;
}

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  @Output() filterChange = new EventEmitter<FilterState>();

  // Seçenek Listeleri
  institutions: InstitutionDto[] = [];
  departments: DepartmentDto[] = []; // Tümü (cache) veya seçili kuruma göre
  courses: CourseDto[] = []; // Seçili bölüme göre

  // Seçili Değerler
  selectedInstitution: string = '';
  selectedDepartment: string = '';
  selectedCourse: string = '';

  // UI State
  isLoadingInst: boolean = false;
  isLoadingDept: boolean = false;
  isLoadingCourse: boolean = false;

  constructor(
    private institutionService: InstitutionService,
    private departmentService: DepartmentService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadInstitutions();
  }

  // --- LOAD DATA ---

  async loadInstitutions() {
    this.isLoadingInst = true;
    try {
      const res = await this.institutionService.getAllInstitutions(0, 1000); // Hepsini getir
      this.institutions = res.institutions;
    } finally {
      this.isLoadingInst = false;
    }
  }

  async onInstitutionChange() {
    // Alt seçimleri sıfırla
    this.selectedDepartment = '';
    this.selectedCourse = '';
    this.departments = [];
    this.courses = [];
    
    this.emitFilter(); // Sadece kurum seçiliyken de filtrele

    if (!this.selectedInstitution) return;

    this.isLoadingDept = true;
    try {
      // Backend'den sadece bu kuruma ait bölümleri çek
      // Not: Backend servisine 'institutionId' parametresi eklemiştik, harika oldu.
      const res = await this.departmentService.getAllDepartments(0, 1000, this.selectedInstitution);
      this.departments = res.departments;
    } finally {
      this.isLoadingDept = false;
    }
  }

  async onDepartmentChange() {
    // Alt seçimi sıfırla
    this.selectedCourse = '';
    this.courses = [];

    this.emitFilter();

    if (!this.selectedDepartment) return;

    this.isLoadingCourse = true;
    try {
      const res = await this.courseService.getAllCourses(0, 1000, this.selectedDepartment);
      this.courses = res.courses;
    } finally {
      this.isLoadingCourse = false;
    }
  }

  onCourseChange() {
    this.emitFilter();
  }

  // --- ACTIONS ---

  resetFilters() {
    this.selectedInstitution = '';
    this.selectedDepartment = '';
    this.selectedCourse = '';
    this.departments = [];
    this.courses = [];
    
    this.emitFilter();
  }

  private emitFilter() {
    this.filterChange.emit({
      institutionId: this.selectedInstitution || undefined,
      departmentId: this.selectedDepartment || undefined,
      courseId: this.selectedCourse || undefined
    });
  }
}
