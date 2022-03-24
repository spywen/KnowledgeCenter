import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSort, MatTableDataSource } from '@angular/material';
import { Customer } from '../../../../models/Customer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerSiteService } from '../../../../services/customer-site.service';
import { CustomerSite } from '../../../../models/CustomerSite';
import { TokenService } from '../../../../../shared/services/token.service';
import { checkIconAnimation, rowsAnimation } from '../../../../../shared/animations';
import { DeleteDialogComponent, DeleteParameters } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { MatchCustomerSiteEditDialogComponent } from './match-customer-site-edit-dialog/match-customer-site-edit-dialog.component';

@Component({
  selector: 'app-match-customer-sites-dialog',
  templateUrl: './match-customer-sites-dialog.component.html',
  styleUrls: ['./match-customer-sites-dialog.component.less'],
  animations: [checkIconAnimation, rowsAnimation]
})
export class MatchCustomerSitesDialogComponent implements OnInit {

  public newCustomerSiteForm: FormGroup;
  public dataSource: MatTableDataSource<CustomerSite> = new MatTableDataSource<CustomerSite>();
  public displayedColumns: string[];
  public customer: Customer;

  constructor(
    public dialogRef: MatDialogRef<MatchCustomerSitesDialogComponent>,
    public tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: any[], // data[0]: Customer, data[1]: CustomerSite[]
    private formBuilder: FormBuilder,
    private customerSiteService: CustomerSiteService,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.customer = this.data[0];

    this.dataSource.data = this.data[1];
    this.dataSource.sort = this.sort;

    if (this.tokenService.hasOneOfRoles(['MATCH_CAM'])) {
      this.displayedColumns = ['name', 'address', 'contact', 'actions'];
    } else {
      this.displayedColumns = ['name', 'address', 'contact'];
    }

    this.newCustomerSiteForm = this.formBuilder.group({
      name: [''],
      address: [''],
      contact: ['']
    });
  }

  formControls(formControlName: string) { return this.newCustomerSiteForm.controls[formControlName]; }

  addCustomerSite() {
    const request = {
      ...this.newCustomerSiteForm.getRawValue(),
      customerId: this.customer.id
    };
    this.customerSiteService.create(request).subscribe((newCustomerSite: CustomerSite) => {
      this.newCustomerSiteForm.reset();
      this.dataSource.data.unshift(newCustomerSite);
      this.dataSource.data = this.dataSource.data;
    });
  }

  resetCustomerSiteForm() {
    this.newCustomerSiteForm.reset();
  }

  editCustomerSite(customerSite: CustomerSite) {
    const dialogRefEdit = this.dialog.open(MatchCustomerSiteEditDialogComponent, {
      width: '500px',
      data: customerSite
    });

    dialogRefEdit.afterClosed().subscribe((editedCustomerSite: CustomerSite) => {
      if (editedCustomerSite) {
        const editedData = this.dataSource.data.find(x => x.id === editedCustomerSite.id);
        editedData.name = editedCustomerSite.name;
        editedData.address = editedCustomerSite.address;
        editedData.contact = editedCustomerSite.contact;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  deleteCustomerSite(customerSite: CustomerSite) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'customer site',
        elementId: customerSite.id,
        name: customerSite.name,
        deleteAction: this.customerSiteService.delete(customerSite.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(customerSite);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }
}
