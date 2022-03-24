import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CustomersService } from '../../../../services/customers.service';
import { Customer } from '../../../../models/Customer';

@Component({
  selector: 'app-match-customer-create-dialog',
  templateUrl: './match-customer-create-dialog.component.html',
  styleUrls: ['./match-customer-create-dialog.component.less']
})
export class MatchCustomerCreateDialogComponent implements OnInit {

  public customerForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MatchCustomerCreateDialogComponent>,
    private formBuilder: FormBuilder,
    private customerService: CustomersService
  ) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({ name: [''] });
  }

  formControls(formControlName: string) {
    return this.customerForm.controls[formControlName];
  }

  onAddClick() {
    this.customerService.create(this.customerForm.getRawValue()).subscribe((newCustomer: Customer) => {
      this.dialogRef.close(newCustomer);
    });
  }
}
