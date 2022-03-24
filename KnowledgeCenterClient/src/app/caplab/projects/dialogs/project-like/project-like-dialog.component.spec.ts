import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLikeDialogComponent } from './project-like-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsService } from 'src/app/caplab/services/projects.service';
import { of } from 'rxjs';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

describe('ProjectLikeDialogComponent', () => {
  let component: ProjectLikeDialogComponent;
  let fixture: ComponentFixture<ProjectLikeDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLikeDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ProjectsService, useValue: { rateProject: () => of() } },
        { provide: MatBottomSheetRef, useValue: { dismiss: () => {} } },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLikeDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
