import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IsNumeric } from '../../../../shared/helpers/CustomValidators';
import { AgencyService } from '../../../../shared/services/agency.service';
import { Agency } from 'src/app/shared/models/Agency';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './agency-edit-dialog.component.html',
  styleUrls: ['./agency-edit-dialog.component.less']
})
export class AgencyEditDialogComponent implements OnInit {

  public agencyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AgencyEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agency,
    private formBuilder: FormBuilder,
    private agencyService: AgencyService
  ) { }

  ngOnInit() {
    this.agencyForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]],
      postalCode: [this.data.postalCode, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    }, {validator: IsNumeric('postalCode')});
  }

  formControls(formControlName: string) { return this.agencyForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.agencyService.update(this.agencyForm.getRawValue()).subscribe((editedAgency: Agency) => {
      this.dialogRef.close(editedAgency);
    });
  }
}
