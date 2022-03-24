import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyEditDialogComponent } from './agency-edit-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Agency } from '../../../../shared/models/Agency';
import { AgencyService } from '../../../../shared/services/agency.service';
import { of } from 'rxjs';

describe('AgencyEditDialogComponent', () => {
  let component: AgencyEditDialogComponent;
  let fixture: ComponentFixture<AgencyEditDialogComponent>;
  let element: HTMLElement;

  const initialAgency = {
    id: 1,
    name: 'Bayonnee',
    postalCode: '64101'
  } as Agency;
  const editedAgency = {
    id: 1,
    name: 'Bayonne',
    postalCode: '64100'
  } as Agency;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyEditDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: initialAgency },
        { provide: AgencyService, useValue: { update: () => of(editedAgency) } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with two fields containing the info of the agency being edited', () => {
    expect(component.agencyForm.get('name').value).toBe('Bayonnee');
    expect(component.agencyForm.get('postalCode').value).toBe('64101');
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', '64100');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no post code is not numeric', () => {
    updateForm('Bayonne', '641X0');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no postalCode is provided', () => {
    updateForm('Bayonne', '');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and postalCode are defined', () => {
    updateForm('Bayonne', '64100');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when editing agency succedeed, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Bayonne', '64100');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(editedAgency);
  });

  function updateForm(name, postalCode) {
    component.agencyForm.controls.name.setValue(name);
    component.agencyForm.controls.postalCode.setValue(postalCode);
  }
});
