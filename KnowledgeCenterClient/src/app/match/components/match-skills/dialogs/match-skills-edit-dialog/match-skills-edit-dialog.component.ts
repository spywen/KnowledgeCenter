import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Skill } from '../../../../models/Skill';
import { SkillService } from '../../../../services/skill.service';

@Component({
  selector: 'app-skill-edit-dialog',
  templateUrl: './match-skills-edit-dialog.component.html',
  styleUrls: ['./match-skills-edit-dialog.component.less']
})
export class MatchSkillsEditDialogComponent implements OnInit {

  public skillForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MatchSkillsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Skill,
    private formBuilder: FormBuilder,
    private skillService: SkillService
  ) { }

  ngOnInit() {
    this.skillForm = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      serviceLineId: [this.data.serviceLineId]
    });
  }

  formControls(formControlName: string) { return this.skillForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.skillService.update(this.skillForm.getRawValue()).subscribe((editedSkill: Skill) => {
      this.dialogRef.close(editedSkill);
    });
  }

}
