import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyCreateDialogComponent } from './agency-create-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgencyService } from '../../../../shared/services/agency.service';
import { of } from 'rxjs';
import { Agency } from '../../../../shared/models/Agency';

describe('AgencyCreateDialogComponent', () => {
  let component: AgencyCreateDialogComponent;
  let fixture: ComponentFixture<AgencyCreateDialogComponent>;
  let element: HTMLElement;

  const defaultAgency = {
    id: 1,
    name: 'Bayonne',
    postalCode: '64100'
  } as Agency;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: AgencyService, useValue: { create: () => of(defaultAgency) } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyCreateDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty form and the add button should be disabled', () => {
    expect(component.agencyForm.get('name').value).toBe('');
    expect(component.agencyForm.get('postalCode').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', '06410');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no postalCode is provided', () => {
    updateForm('Nice-Sophia Antipolis', '');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and postalCode are defined', () => {
    updateForm('Nice-Sophia Antipolis', '06410');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when adding an agency succedeed, should close dialog', (() => {
    const newAgency = { id: 1, name: 'biot', postalCode: '06410'} as Agency;
    spyOn(TestBed.get(AgencyService), 'create').and.returnValue(of(newAgency));
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Bayonne', '64100');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(newAgency);
  }));

  function updateForm(name: string, postalCode: string) {
    component.agencyForm.controls.name.setValue(name);
    component.agencyForm.controls.postalCode.setValue(postalCode);
  }
});

