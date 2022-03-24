import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCustomerEditDialogComponent } from './match-customer-edit-dialog.component';
import { Customer } from '../../../../models/Customer';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { CustomersService } from '../../../../services/customers.service';

describe('MatchCustomerEditDialogComponent', () => {
  let component: MatchCustomerEditDialogComponent;
  let fixture: ComponentFixture<MatchCustomerEditDialogComponent>;
  let element: HTMLElement;

  const initialCustomer = {
    id: 1,
    name: 'Ama'
  } as Customer;
  const editedCustomer = {
    id: 1,
    name: 'Amadeus'
  } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchCustomerEditDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: initialCustomer },
        { provide: CustomersService, useValue: { update: () => of(editedCustomer) } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchCustomerEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with one field containing the info of the customer being edited', () => {
    expect(component.customerForm.get('name').value).toBe('Ama');
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name is defined', () => {
    updateForm('Amadeus');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when editing customer succeeded, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Amadeus');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(editedCustomer);
  });


  function updateForm(name) {
    component.customerForm.controls.name.setValue(name);
  }
});
