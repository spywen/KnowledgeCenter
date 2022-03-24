import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceLineService } from '../../../../shared/services/service-line.service';

@Component({
  selector: 'app-service-line-edit-dialog',
  templateUrl: './service-line-edit-dialog.component.html',
  styleUrls: ['./service-line-edit-dialog.component.less']
})
export class ServiceLineEditDialogComponent implements OnInit {
  public serviceLineForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ServiceLineEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceLine,
    private formBuilder: FormBuilder,
    private serviceLineService: ServiceLineService
  ) {}

  ngOnInit() {
    this.serviceLineForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required,
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]],
      description: [this.data.description, [Validators.required, Validators.maxLength(100)]]
    });
  }

  formControls(formControlName: string) { return this.serviceLineForm.controls[formControlName]; }

  onUpdateClick() {
    this.serviceLineService.update(this.serviceLineForm.getRawValue()).subscribe((editedServiceLine: ServiceLine) => {
      this.dialogRef.close(editedServiceLine);
    });
  }
}
