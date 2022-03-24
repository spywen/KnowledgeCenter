import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceLineEditDialogComponent } from './service-line-edit-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ServiceLineService } from '../../../../shared/services/service-line.service';

describe('ServiceLineEditDialogComponent', () => {
  let component: ServiceLineEditDialogComponent;
  let fixture: ComponentFixture<ServiceLineEditDialogComponent>;
  let element: HTMLElement;

  const initialServiceLine = {
    id: 1,
    name: 'DITT',
    description: 'Digital Innovation And Technology X'
  } as ServiceLine;
  const editedServiceLine = {
    id: 1,
    name: 'DIT',
    description: 'Digital Innovation And Technology'
  } as ServiceLine;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLineEditDialogComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: initialServiceLine },
        { provide: ServiceLineService, useValue: { update: () => of(editedServiceLine) } },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLineEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with two fields containing the info of the agency being edited', () => {
    expect(component.serviceLineForm.get('name').value).toBe('DITT');
    expect(component.serviceLineForm.get('description').value).toBe('Digital Innovation And Technology X');
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', 'Digital Innovation And Technology');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no description is provided', () => {
    updateForm('DIT', '');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and description are defined', () => {
    updateForm('DIT', 'Digital Innovation And Technology');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeFalsy();
  });

  it('when editing service line succedeed, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('DIT', 'Digital Innovation And Technology');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(editedServiceLine);
  });

  function updateForm(name, description) {
    component.serviceLineForm.controls.name.setValue(name);
    component.serviceLineForm.controls.description.setValue(description);
  }
});

