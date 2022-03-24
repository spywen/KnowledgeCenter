import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CollaboratorSkill } from '../../../../models/CollaboratorSkill';
import { CollaboratorsService } from '../../../../services/collaborators.service';
import { SkillLevel } from '../../../../models/SkillLevel';

export interface SkillEditParameters {
  collaboratorId: number;
  skillToEdit: CollaboratorSkill;
  skillLevels: SkillLevel[];
}

@Component({
  selector: 'app-match-collaborators-edit-dialog',
  templateUrl: './match-collaborators-skill-edit-dialog.component.html',
  styleUrls: ['./match-collaborators-skill-edit-dialog.component.less']
})
export class MatchCollaboratorsSkillEditDialogComponent implements OnInit {

  public skillLevels: SkillLevel[];
  public collaboratorSkillForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MatchCollaboratorsSkillEditDialogComponent>,
    private formBuilder: FormBuilder,
    private collaboratorsService: CollaboratorsService,
    @Inject(MAT_DIALOG_DATA) public data: SkillEditParameters
  ) { }

  ngOnInit() {
    this.collaboratorSkillForm = this.formBuilder.group({
      skillId: [this.data.skillToEdit.skillId],
      skillLevelId: [this.data.skillToEdit.skillLevelId]
    });

    this.skillLevels = this.data.skillLevels;
  }

  formControls(formControlName: string) { return this.collaboratorSkillForm.controls[formControlName]; }

  onUpdateClick(): void {
    this.data.skillToEdit.skillLevelId = this.collaboratorSkillForm.controls.skillLevelId.value;
    this.collaboratorsService
      .updateCollaboratorSkillLevel(this.data.collaboratorId, this.data.skillToEdit.skill.id, this.data.skillToEdit)
      .subscribe((editedCollaboratorSkill: CollaboratorSkill) => {
        this.dialogRef.close(editedCollaboratorSkill);
      });
  }
}
