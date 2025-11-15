import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNotePdfDialogComponent } from './select-note-pdf-dialog.component';

describe('SelectNotePdfDialogComponent', () => {
  let component: SelectNotePdfDialogComponent;
  let fixture: ComponentFixture<SelectNotePdfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectNotePdfDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectNotePdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
