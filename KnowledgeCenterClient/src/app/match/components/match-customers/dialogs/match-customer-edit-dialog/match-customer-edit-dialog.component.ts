import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Customer } from '../../../../models/Customer';
import { CustomersService } from '../../../../services/customers.service';

@Component({
  selector: 'app-match-customer-edit-dialog',
  templateUrl: './match-customer-edit-dialog.component.html',
  styleUrls: ['./match-customer-edit-dialog.component.less']
})
export class MatchCustomerEditDialogComponent implements OnInit {

  public customerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MatchCustomerEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private formBuilder: FormBuilder,
    private customersService: CustomersService
  ) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name]
    });
  }

  formControls(formControlName: string) { return this.customerForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.customersService.update(this.customerForm.getRawValue()).subscribe((editedCustomer: Customer) => {
      this.dialogRef.close(editedCustomer);
    });
  }
}
