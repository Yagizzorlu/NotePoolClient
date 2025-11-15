import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesUploadComponent } from './notes-upload.component';

describe('NotesUploadComponent', () => {
  let component: NotesUploadComponent;
  let fixture: ComponentFixture<NotesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotesUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
