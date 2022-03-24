import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerSite } from '../../../../../models/CustomerSite';
import { CustomerSiteService } from '../../../../../services/customer-site.service';

@Component({
  selector: 'app-match-customer-site-edit-dialog',
  templateUrl: './match-customer-site-edit-dialog.component.html',
  styleUrls: ['./match-customer-site-edit-dialog.component.less']
})
export class MatchCustomerSiteEditDialogComponent implements OnInit {

  public customerSiteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MatchCustomerSiteEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerSite,
    private formBuilder: FormBuilder,
    private customerSiteService: CustomerSiteService
  ) { }

  ngOnInit() {
    this.customerSiteForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name],
      address: [this.data.address],
      contact: [this.data.contact],
    });
  }

  formControls(formControlName: string) { return this.customerSiteForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.customerSiteService.update(this.customerSiteForm.getRawValue()).subscribe((editedCustomerSite: CustomerSite) => {
      this.dialogRef.close(editedCustomerSite);
    });
  }
}
