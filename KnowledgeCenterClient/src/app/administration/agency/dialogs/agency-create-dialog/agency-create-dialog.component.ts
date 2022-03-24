import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IsNumeric } from '../../../../shared/helpers/CustomValidators';
import { Agency } from '../../../../shared/models/Agency';
import { AgencyService } from '../../../../shared/services/agency.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './agency-create-dialog.component.html',
  styleUrls: ['./agency-create-dialog.component.less']
})
export class AgencyCreateDialogComponent implements OnInit {

  public agencyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgencyCreateDialogComponent>,
    private formBuilder: FormBuilder,
    private agencyService: AgencyService
  ) { }

  ngOnInit() {
    this.agencyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    }, { validator: IsNumeric('postalCode') });
  }

  formControls(formControlName: string) {
    return this.agencyForm.controls[formControlName];
  }

  onAddClick() {
    this.agencyService.create(this.agencyForm.getRawValue()).subscribe((newAgency: Agency) => {
      this.dialogRef.close(newAgency);
    });
  }
}
