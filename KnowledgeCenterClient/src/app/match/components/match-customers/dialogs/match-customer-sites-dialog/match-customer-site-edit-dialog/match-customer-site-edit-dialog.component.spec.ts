import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCustomerSiteEditDialogComponent } from './match-customer-site-edit-dialog.component';
import { CustomerSite } from '../../../../../models/CustomerSite';
import { Customer } from '../../../../../models/Customer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CustomerSiteService } from '../../../../../services/customer-site.service';

describe('MatchCustomerSiteEditDialogComponent', () => {
  let component: MatchCustomerSiteEditDialogComponent;
  let fixture: ComponentFixture<MatchCustomerSiteEditDialogComponent>;
  let element: HTMLElement;

  let customerSite: CustomerSite;

  beforeEach((() => {
    initData();

    TestBed.configureTestingModule({
      declarations: [ MatchCustomerSiteEditDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: customerSite },
        { provide: CustomerSiteService, useValue: { update: () => of(customerSite) } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchCustomerSiteEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with one field containing the info of the customer site being edited', () => {
    expect(component.customerSiteForm.get('name').value).toBe('Paris');
    expect(component.customerSiteForm.get('address').value).toBe('address');
    expect(component.customerSiteForm.get('contact').value).toBe('contact');
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', 'address', 'contact');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no address is provided', () => {
    updateForm('Paris Amadeus', '', 'contact');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and address are defined', () => {
    updateForm('Paris Amadeus', 'address', null);
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when editing customer succeeded, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Paris Amadeus', 'address', null);
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(customerSite);
  });

  function updateForm(name, address, contact) {
    component.customerSiteForm.controls.name.setValue(name);
    component.customerSiteForm.controls.address.setValue(address);
    component.customerSiteForm.controls.contact.setValue(contact);
  }

  function initData(): void {
    customerSite = {
      id: 1,
      name: 'Paris',
      address: 'address',
      contact: 'contact',
      customer: { id: 1, name: 'Amadeus'} as Customer,
      customerId: 1
    };
  }
});
