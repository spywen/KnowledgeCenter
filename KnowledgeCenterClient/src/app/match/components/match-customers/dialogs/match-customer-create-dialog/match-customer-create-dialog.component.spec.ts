import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCustomerCreateDialogComponent } from './match-customer-create-dialog.component';
import { Customer } from '../../../../models/Customer';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { CustomersService } from '../../../../services/customers.service';

describe('MatchCustomerCreateDialogComponent', () => {
  let component: MatchCustomerCreateDialogComponent;
  let fixture: ComponentFixture<MatchCustomerCreateDialogComponent>;
  let element: HTMLElement;

  const defaultCustomer = {
    id: 1,
    name: 'Amadeus'
  } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchCustomerCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: CustomersService, useValue: { create: () => of(defaultCustomer) } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchCustomerCreateDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty form and the add button should be disabled', () => {
    expect(component.customerForm.get('name').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
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

  it('when adding a customer succeeded, should close dialog', (() => {
    const newCustomer = { id: 1, name: 'Amadeus'} as Customer;
    spyOn(TestBed.get(CustomersService), 'create').and.returnValue(of(newCustomer));
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Amadeus');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(newCustomer);
  }));


  function updateForm(name: string) {
    component.customerForm.controls.name.setValue(name);
  }
});
