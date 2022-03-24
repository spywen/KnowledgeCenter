import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ServiceLine } from '../../../../../shared/models/ServiceLine';
import { SkillService } from '../../../../services/skill.service';
import { Skill } from '../../../../models/Skill';

@Component({
  selector: 'app-skill-create-dialog',
  templateUrl: './match-skills-create-dialog.component.html',
  styleUrls: ['./match-skills-create-dialog.component.less']
})
export class MatchSkillsCreateDialogComponent implements OnInit {

  public skillForm: FormGroup;
  public serviceLines: ServiceLine[];

  constructor(
    public dialogRef: MatDialogRef<MatchSkillsCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private skillService: SkillService
  ) { }

  ngOnInit() {
    this.skillForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      serviceLineId: [this.data.defaultServiceLineId !== undefined ? this.data.defaultServiceLineId : '', [Validators.required]]
    });
    this.serviceLines = this.data.serviceLines;
  }

  formControls(formControlName: string) {
    return this.skillForm.controls[formControlName];
  }

  onAddClick() {
    this.skillService.create(this.skillForm.getRawValue()).subscribe((newSkill: Skill) => {
      this.dialogRef.close(newSkill);
    });
  }
}
