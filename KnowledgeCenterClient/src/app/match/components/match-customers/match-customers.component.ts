import { Component, OnInit, ViewChild } from '@angular/core';
import { rowsAnimation } from '../../../shared/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { TokenService } from '../../../shared/services/token.service';
import { CustomersService, DEFAULT_CUSTOMER_PER_PAGE } from '../../services/customers.service';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../models/Customer';
import { DeleteDialogComponent, DeleteParameters } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { MatchCustomerEditDialogComponent } from './dialogs/match-customer-edit-dialog/match-customer-edit-dialog.component';
import { MatchCustomerCreateDialogComponent } from './dialogs/match-customer-create-dialog/match-customer-create-dialog.component';
import { BasePaginationRequest, BasePaginationResponse } from '../../../shared/models/BasePagination';
import { CustomerFilter } from '../../models/CustomerFilter';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CustomerSiteService, DEFAULT_CUSTOMER_SITE_PER_PAGE } from '../../services/customer-site.service';
import { CustomerSiteFilter } from '../../models/CustomerSiteFilter';
import { CustomerSite } from '../../models/CustomerSite';
import { MatchCustomerSitesDialogComponent } from './dialogs/match-customer-sites-dialog/match-customer-sites-dialog.component';

@Component({
  selector: 'app-match-customers',
  templateUrl: './match-customers.component.html',
  styleUrls: ['./match-customers.component.less'],
  animations: [rowsAnimation]
})
export class MatchCustomersComponent implements OnInit {

  private readonly debounceTime = 200;
  private currentPage = 1;
  private lastPageNumber = 1;

  private searchFieldTextChanged: Subject<string> = new Subject();
  private customerFilter: CustomerFilter = { keyword: '' };
  public filterForm: FormGroup;

  public dataSource: MatTableDataSource<Customer>;
  public displayedColumns: string[];

  constructor(
    private customersService: CustomersService,
    private customerSiteService: CustomerSiteService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public tokenService: TokenService
  ) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public ngOnInit() {
    this.route.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.customersResolverResult.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.lastPageNumber = (data.customersResolverResult.data as BasePaginationResponse<Customer[]>).totalPages;
    });

    if (this.tokenService.hasOneOfRoles(['MATCH_CAM'])) {
      this.displayedColumns = ['name', 'actions'];
    } else {
      this.displayedColumns = ['name'];
    }

    this.filterForm = this.formBuilder.group({ filter: [''] });

    this.searchFieldTextChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(searchFieldValue => {
        this.customerFilter.keyword = searchFieldValue;
        this.getCustomers();
      });
  }

  public add() {
    const dialogRefAdd = this.dialog.open(MatchCustomerCreateDialogComponent, {
      width: '500px'
    });

    dialogRefAdd.afterClosed().subscribe((newCustomer: Customer) => {
      if (newCustomer) {
        this.filterForm.reset();
        this.dataSource.data.unshift(newCustomer);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  public editSites(customer: Customer) {
    this.customerSiteService.getAll({
      page: 1,
      size: DEFAULT_CUSTOMER_SITE_PER_PAGE,
      filters: {
        customerId: customer.id,
        keyword: ''
      } as CustomerSiteFilter
    } as BasePaginationRequest<CustomerSiteFilter>).subscribe((response: BasePaginationResponse<CustomerSite[]>) => {
      const customerSites = response.data;

      this.dialog.open(MatchCustomerSitesDialogComponent, {
        width: '80%',
        data: [customer, customerSites]
      });
    });
  }

  public edit(customer: Customer) {
    const dialogRefEdit = this.dialog.open(MatchCustomerEditDialogComponent, {
      width: '500px',
      data: customer
    });

    dialogRefEdit.afterClosed().subscribe((editedCustomer: any) => {
      if (editedCustomer) {
        const element = this.dataSource.data.find(x => x.id === customer.id);
        element.name = editedCustomer.name;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  public delete(customer: Customer): void {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'customer',
        name: customer.name,
        elementId: customer.id,
        deleteAction: this.customersService.delete(customer.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(customer);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  public onSearchFieldValueChanged(event: any) {
    this.searchFieldTextChanged.next(event.target.value.trim().toLowerCase());
  }

  public onScrollDown() {
    if (this.currentPage + 1 > this.lastPageNumber) {
      return;
    }
    this.currentPage++;
    this.getCustomers(false);
  }

  private getCustomers(shouldResetPagination: boolean = true) {
    if (shouldResetPagination) {
      this.currentPage = 1;
    }

    this.customersService.getAll({
      filters: this.customerFilter,
      page: this.currentPage,
      size: DEFAULT_CUSTOMER_PER_PAGE
    } as BasePaginationRequest<CustomerFilter>)
      .subscribe((response: BasePaginationResponse<Customer[]>) => {
        this.lastPageNumber = response.totalPages;

        if (shouldResetPagination) {
          this.dataSource.data = response.data;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = this.dataSource.data.concat(response.data);
        }
      });
  }
}
