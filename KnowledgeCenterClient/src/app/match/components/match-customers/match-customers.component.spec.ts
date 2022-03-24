import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCustomersComponent } from './match-customers.component';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../services/customers.service';
import { Customer } from '../../models/Customer';
import { BasePaginationResponse } from '../../../shared/models/BasePagination';
import { TokenService } from '../../../shared/services/token.service';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { MatchCustomerEditDialogComponent } from './dialogs/match-customer-edit-dialog/match-customer-edit-dialog.component';
import { MatchCustomerCreateDialogComponent } from './dialogs/match-customer-create-dialog/match-customer-create-dialog.component';
import { CustomerSiteService } from '../../services/customer-site.service';
import { CustomerSite } from '../../models/CustomerSite';
import { MatchCustomerSitesDialogComponent } from './dialogs/match-customer-sites-dialog/match-customer-sites-dialog.component';

describe('MatchCustomersComponent', () => {
  let component: MatchCustomersComponent;
  let fixture: ComponentFixture<MatchCustomersComponent>;
  let element: HTMLElement;

  let customerResolverResults: BasePaginationResponse<Customer[]>;
  let amadeusCustomer: Customer;
  let koneCustomer: Customer;
  let customerSite: CustomerSite;
  let customerSiteResults: BasePaginationResponse<CustomerSite[]>;

  const mockUserRole = (userRoles: string[]) => {
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.callFake((requiredRoles: string[]) => {
      let isAllowed = false;
      requiredRoles.forEach(requiredRole => {
        if (userRoles.includes(requiredRole)) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
  };

  beforeEach((() => {
    initData();

    TestBed.configureTestingModule({
      declarations: [ MatchCustomersComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CustomersService, useValue: {
            getAll: () => of(),
            delete: () => of() } },
        { provide: CustomerSiteService, useValue: { getAll: () => of(customerSiteResults) } },
        { provide: ActivatedRoute, useValue:
            { data: of({customersResolverResult: customerResolverResults}) } },
        { provide: MatDialog, useValue: { open: () => {} } },
        { provide: TokenService, useValue: { hasOneOfRoles: () => true } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchCustomersComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty search field and a table with 2 rows', () => {
    const filterInput = element.querySelector<HTMLInputElement>('input[name=filter]');
    filterInput.value = '';

    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual({id: 1, name: 'Amadeus'});
    expect(component.dataSource.data[1]).toEqual({id: 2, name: 'Kone'});
  });

  it('should display table with actions column when user has MATCH_CAM role', () => {
    mockUserRole(['MATCH_CAM']);
    component.ngOnInit();

    expect(element.querySelectorAll('.actions-column')).not.toBeNull();
  });

  it('should not display table with actions column when user does not have MATCH_CAM role', () => {
    mockUserRole(['MATCH_RM', 'MATCH_ADMIN', 'ADMIN']);
    component.ngOnInit();

    expect(component.displayedColumns).not.toContain('actions');
  });

  it('should open the edit customer sites dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editSites(customerResolverResults.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(MatchCustomerSitesDialogComponent, {
        width: '80%',
        data: [ customerResolverResults.data[0], customerSiteResults.data ]
      });
    });

  describe('add customer', () => {
    it('if MATCH_CAM, should open the add customer dialog when the plus icon is clicked', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('button.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(MatchCustomerCreateDialogComponent, {
        width: '500px'
      });
    });

    it('should not display add button when user does not have MATCH_CAM role', () => {
      mockUserRole(['MATCH_RM', 'MATCH_ADMIN', 'ADMIN']);
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button')).toBeNull();
    });

    it('should not refresh datasource and reset form when nothing created', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterFormResetSpy = spyOn(component.filterForm, 'reset');

      component.add();

      expect(component.dataSource.data.length).toBe(2);
      expect(filterFormResetSpy).not.toHaveBeenCalled();
    });

    it('should refresh datasource and reset form when customer created', () => {
      const newCustomer = { id: 3, name: 'Nice Métropole'} as Customer;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(newCustomer)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterInput = element.querySelector<HTMLInputElement>('input[name=filter]');
      filterInput.value = 'ko';

      component.add();

      expect(component.dataSource.data.length).toBe(3);
      expect(component.dataSource.data[0]).toBe(newCustomer);
      expect(filterInput.value).toBe('');
    });
  });

  describe('edit customer', () => {
    it('should open the edit customer dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(customerResolverResults.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(MatchCustomerEditDialogComponent, {
        width: '500px',
        data: customerResolverResults.data[0]
      });
    });

    it('should not refresh datasource when nothing edited', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(customerResolverResults.data[0]);

      expect(component.dataSource.data[0].name).toBe(customerResolverResults.data[0].name);
    });

    it('should refresh datasource when customer updated', () => {
      const editedCustomer = {
        ...customerResolverResults.data[0],
        name: 'Amade'
      } as Customer;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedCustomer)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].id).toBe(editedCustomer.id);
      expect(component.dataSource.data[0].name).toBe(editedCustomer.name);
    });
  });

  describe('delete customer', () => {
    it('should open the delete dialog when user click on delete button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(customerResolverResults.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: customerResolverResults.data[0].id,
          name: customerResolverResults.data[0].name,
          type: 'customer'
        })
      }));
    });

    it('should not refresh datasource when nothing deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(customerResolverResults.data[0]);

      expect(component.dataSource.data.length).toBe(2);
    });

    it('should refresh datasource when customer deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.findIndex(x => x.name === 'Amadeus')).toBe(-1);
    });
  });

  function initData(): void {
    amadeusCustomer = { id: 1, name: 'Amadeus' } as Customer;
    koneCustomer = { id: 2, name: 'Kone' } as Customer;
    customerSite = { id: 1, name: 'Site 1' } as CustomerSite;

    customerResolverResults = {
      data: [amadeusCustomer, koneCustomer],
      page: 1,
      size: 1,
      totalItems: 2,
      totalPages: 2
    } as BasePaginationResponse<Customer[]>;
    customerSiteResults = {
      data: [customerSite],
      page: 1,
      size: 1,
      totalItems: 1,
      totalPages: 2
    } as BasePaginationResponse<CustomerSite[]>;
  }
});
