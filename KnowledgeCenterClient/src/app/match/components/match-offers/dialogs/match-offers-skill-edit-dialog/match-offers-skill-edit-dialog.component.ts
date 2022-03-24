import { Component, Inject, OnInit } from '@angular/core';
import { SkillLevel } from '../../../../models/SkillLevel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerOfferSkill } from '../../../../models/CustomerOfferSkill';
import { OfferService } from '../../../../services/offer.service';

export interface CustomerOfferSkillEditParameters {
  customerOfferId: number;
  skillToEdit: CustomerOfferSkill;
  skillLevels: SkillLevel[];
}

@Component({
  selector: 'app-match-offers-skill-edit-dialog',
  templateUrl: './match-offers-skill-edit-dialog.component.html',
  styleUrls: ['./match-offers-skill-edit-dialog.component.less']
})
export class MatchOffersSkillEditDialogComponent implements OnInit {

  public skillLevels: SkillLevel[];
  public customerOfferSkillForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MatchOffersSkillEditDialogComponent>,
    private formBuilder: FormBuilder,
    private offerService: OfferService,
    @Inject(MAT_DIALOG_DATA) public data: CustomerOfferSkillEditParameters
  ) { }

  ngOnInit() {
    this.customerOfferSkillForm = this.formBuilder.group({
      skillId: [this.data.skillToEdit.skillId],
      skillLevelId: [this.data.skillToEdit.skillLevelId]
    });

    this.skillLevels = this.data.skillLevels;
  }

  formControls(formControlName: string) { return this.customerOfferSkillForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.data.skillToEdit.skillLevelId = this.customerOfferSkillForm.controls.skillLevelId.value;
    this.offerService
      .updateCustomerOfferSkillLevel(this.data.customerOfferId, this.data.skillToEdit.skill.id, this.data.skillToEdit)
      .subscribe((editedCustomerOfferSkill: CustomerOfferSkill) => {
        this.dialogRef.close(editedCustomerOfferSkill);
      });
  }
}
