import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDialogComponent } from './delete-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let element: HTMLElement;

  const deleteParameters = {
    deleteAction: of(true),
    elementId: '1',
    type: 'agency',
    name: 'Biot'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: deleteParameters },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display expected message', () => {
    expect(element.querySelector<HTMLSpanElement>('.mat-dialog-content span').textContent)
      .toBe('You are about to delete the following agency: Biot');
  });

  it('should close dialog with isSuccess true when user click on delete button', () => {
    const dialoRefCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');

    element.querySelector<HTMLButtonElement>('.mat-flat-button').click();

    expect(dialoRefCloseSpy).toHaveBeenCalledWith(true);
  });
});
