import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { ServiceLineService } from '../../../../shared/services/service-line.service';

@Component({
  selector: 'app-service-line-create-dialog',
  templateUrl: './service-line-create-dialog.component.html',
  styleUrls: ['./service-line-create-dialog.component.less']
})
export class ServiceLineCreateDialogComponent implements OnInit {
  public serviceLineForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ServiceLineCreateDialogComponent>,
    private formBuilder: FormBuilder,
    private serviceLineService: ServiceLineService
  ) {}

  ngOnInit() {
    this.serviceLineForm = this.formBuilder.group({
      name: [ '', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  formControls(formControlName: string) { return this.serviceLineForm.controls[formControlName]; }

  onAddClick() {
    this.serviceLineService.create(this.serviceLineForm.getRawValue()).subscribe((createdServiceLine: ServiceLine) => {
      this.dialogRef.close(createdServiceLine);
    });
  }
}
