import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreateEditDialogComponent } from './project-create-edit-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProjectsService } from 'src/app/caplab/services/projects.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AngularEditorModule } from '@kolkov/angular-editor';

describe('ProjectCreateEditDialogComponent', () => {
  let component: ProjectCreateEditDialogComponent;
  let fixture: ComponentFixture<ProjectCreateEditDialogComponent>;
  let element: HTMLElement;

  beforeEach((() => {

    TestBed.configureTestingModule({
      declarations: [ ProjectCreateEditDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
        AngularEditorModule
      ],
      providers: [
        { provide: ProjectsService, useValue: { create: () => of() } },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreateEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
