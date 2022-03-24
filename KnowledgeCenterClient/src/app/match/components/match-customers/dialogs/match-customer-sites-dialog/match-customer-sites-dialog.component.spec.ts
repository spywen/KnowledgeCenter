import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCustomerSitesDialogComponent } from './match-customer-sites-dialog.component';
import { CustomerSite } from '../../../../models/CustomerSite';
import { Customer } from '../../../../models/Customer';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerSiteService } from '../../../../services/customer-site.service';
import { MatchCustomerSiteEditDialogComponent } from './match-customer-site-edit-dialog/match-customer-site-edit-dialog.component';

describe('MatchCustomerSitesDialogComponent', () => {
  let component: MatchCustomerSitesDialogComponent;
  let fixture: ComponentFixture<MatchCustomerSitesDialogComponent>;
  let element: HTMLElement;

  let customer: Customer;
  let customerSites: CustomerSite[];
  let newCustomerSite: CustomerSite;

  beforeEach((() => {

    initData();

    TestBed.configureTestingModule({
      declarations: [ MatchCustomerSitesDialogComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: [customer, customerSites] },
        {
          provide: CustomerSiteService, useValue: {
            update: () => of(customerSites),
            delete: () => of(),
            create: () => of(newCustomerSite)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchCustomerSitesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table with 2 rows and empty form without check button', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual(customerSites[0]);
    expect(component.dataSource.data[1]).toEqual(customerSites[1]);

    expect(component.newCustomerSiteForm.get('name').value).toBe('');
    expect(component.newCustomerSiteForm.get('address').value).toBe('');
    expect(component.newCustomerSiteForm.get('contact').value).toBe('');

    expect(element.querySelector<HTMLButtonElement>('.checkIcon')).toBeNull();
  });

  describe('create customer site', () => {
    it('button should not exist when no name is provided', () => {
      updateForm('', 'address', 'contact');
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.checkIcon')).toBeNull();
    });

    it('button should not exist when no address is provided', () => {
      updateForm('new Site', '', 'contact');
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.checkIcon')).toBeNull();
    });

    it('when adding customer site succeeded, should add new item to the table', () => {
      updateForm(newCustomerSite.name, newCustomerSite.address, newCustomerSite.contact);
      fixture.detectChanges();

      component.addCustomerSite();

      expect(component.dataSource.data.length).toBe(3);
      expect(component.dataSource.data[0]).toEqual(newCustomerSite);
    });
  });

  describe('delete customer site', () => {
    it('should open the delete dialog when user click on delete customer site button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCustomerSite(component.dataSource.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: customerSites[0].id,
          name: customerSites[0].name,
          type: 'customer site'
        })
      }));
    });

    it('should not refresh datasource when no customer site was deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCustomerSite(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(2);
    });

    it('should refresh datasource when a skill was deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCustomerSite(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.findIndex(x => x.name === 'Paris')).toBe(-1);
    });
  });


  describe('edit customer site', () => {
    it('should open the edit customer site dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editCustomerSite(component.dataSource.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(MatchCustomerSiteEditDialogComponent, {
        width: '500px',
        data: customerSites[0]
      });
    });

    it('should not refresh the datasource when the customer site wasn\'t edited', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editCustomerSite(component.dataSource.data[0]);

      expect(component.dataSource.data[0].name).toBe('Paris');
      expect(component.dataSource.data[0].address).toBe('Address for Paris');
      expect(component.dataSource.data[0].contact).toBe('Contact tel or email');
    });

    it('should refresh datasource when the customer site was updated', () => {
      const editedCustomerSite = {
        ...customerSites[0],
        name: 'Paris Amadeus site'
      } as CustomerSite;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedCustomerSite)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editCustomerSite(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].name).toBe('Paris Amadeus site');
      expect(component.dataSource.data[0].address).toBe('Address for Paris');
      expect(component.dataSource.data[0].contact).toBe('Contact tel or email');
    });
  });


  function updateForm(name, address, contact) {
    component.newCustomerSiteForm.controls.name.setValue(name);
    component.newCustomerSiteForm.controls.address.setValue(address);
    component.newCustomerSiteForm.controls.contact.setValue(contact);
  }


  function initData(): void {
    customer = { id: 1, name: 'Amadeus' } as Customer;
    customerSites = [
      {
        id: 1,
        name: 'Paris',
        address: 'Address for Paris',
        contact: 'Contact tel or email',
        customer,
        customerId: customer.id
      },
      {
        id: 2,
        name: 'Sophia Antipolis',
        address: 'Address for Sophia',
        contact: null,
        customer,
        customerId: customer.id
      }
    ] as CustomerSite[];
    newCustomerSite = {
      id: 3,
      name: 'new Site',
      address: 'address',
      contact: 'contact',
      customer,
      customerId: customer.id
    } as CustomerSite;
  }
});
