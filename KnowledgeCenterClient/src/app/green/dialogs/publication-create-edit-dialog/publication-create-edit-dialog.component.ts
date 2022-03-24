import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Publication } from '../../models/Publication';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PublicationsService } from '../../services/publications.service';
import { CreateOrUpdatePublication } from '../../models/CreateOrUpdatePublication';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { formatDate } from '@angular/common';

export interface PublicationDialogParameters {
  publication: Publication;
  publicationTypes: Array<SimpleEnum>;
}

@Component({
  selector: 'app-publication-create-edit-dialog',
  templateUrl: './publication-create-edit-dialog.component.html',
  styleUrls: ['./publication-create-edit-dialog.component.less']
})
export class PublicationCreateEditDialogComponent implements OnInit {

  public publicationForm: FormGroup;
  public isEdition = false;
  private publication: CreateOrUpdatePublication;
  public publicationTypes: Array<SimpleEnum>;

  constructor(
    private dialogRef: MatDialogRef<PublicationCreateEditDialogComponent>,
    private formBuilder: FormBuilder,
    private publicationService: PublicationsService,
    @Inject(MAT_DIALOG_DATA) private data: PublicationDialogParameters,
  ) {
    this.publicationTypes = this.data.publicationTypes;
    if (this.data.publication) {
      this.isEdition = true;
      this.publication = this.data.publication;
    }
  }

  ngOnInit() {
    if (this.isEdition) {
      this.publicationForm = this.formBuilder.group({
        id: [this.publication.id],
        message: [this.publication.message, [Validators.required, Validators.maxLength(400)]],
        publicationDate: [formatDate(this.publication.publicationDate, 'yyyy-MM-ddTHH:mm', 'en-GB', '+0100'), [Validators.required]],
        publicationTypeId: [this.publication.publicationTypeId, [Validators.required]]
      });
    } else {
      this.publicationForm = this.formBuilder.group({
        message: ['', [Validators.required, Validators.maxLength(400)]],
        publicationDate: ['', [Validators.required]],
        publicationTypeId: ['', [Validators.required]]
      });
    }
  }

  public formControls(formControlName: string) {
    return this.publicationForm.controls[formControlName];
  }

  public confirm() {
    if (this.isEdition) {
      const dateValue = new Date(this.formControls('publicationDate').value);
      this.formControls('publicationDate').setValue(new Date(dateValue.toUTCString()));
      this.publicationService.update(this.publicationForm.getRawValue()).subscribe((editedPublication: CreateOrUpdatePublication) => {
        this.dialogRef.close(editedPublication);
      });
    } else {
      const dateValue = new Date(this.formControls('publicationDate').value);
      this.formControls('publicationDate').setValue(new Date(dateValue.toUTCString()));
      this.publicationService.create(this.publicationForm.getRawValue()).subscribe((newPublication: CreateOrUpdatePublication) => {
        this.dialogRef.close(newPublication);
      });
    }
  }

}
