import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProjectsService } from '../../../services/projects.service';
import { Project } from 'src/app/caplab/models/Project';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

export interface ProjectDialogParameters {
  project: Project;
  tags: Array<SimpleEnum>;
}

// tslint:disable-next-line:max-line-length
const FullDescriptionExample = '<i>Please find some ideas to complete your full&nbsp;description<font face="Roboto">&nbsp;:</font></i><div><ul><li><i>What are the objectives?</i></li><li><i>What are the resources needed ?&nbsp;</i></li><li><i>How many collaborator needed for the project ?&nbsp;</i></li><li><i>Do you need a specific resource to do that ?</i></li></ul>';

@Component({
  selector: 'app-project-create-edit-dialog',
  templateUrl: './project-create-edit-dialog.component.html',
  styleUrls: ['./project-create-edit-dialog.component.less']
})
export class ProjectCreateEditDialogComponent implements OnInit {

  public projectForm: FormGroup;
  public tags: Array<SimpleEnum>;
  public isEdition = false;
  private project: Project;

  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter full description of your project there...',
    translate: 'no',
    defaultFontName: 'Roboto',
    fonts: [
      {class: 'Roboto', name: 'Roboto'}
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<ProjectCreateEditDialogComponent>,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogParameters,
  ) {
    this.tags = data.tags;
    if (data.project) {
      this.isEdition = true;
      this.project = data.project;
    }
  }

  ngOnInit() {
    if (this.isEdition) {
      this.projectForm = this.formBuilder.group({
        id: [this.project.id],
        title: [this.project.title, [Validators.required, Validators.maxLength(140)]],
        shortDescription: [this.project.shortDescription, [Validators.required, Validators.maxLength(300)]],
        description: [this.project.description, []],
        tagIds: [this.project.tags.map(x => x.id), []]
      });
    } else {
      this.projectForm = this.formBuilder.group({
        title: ['', [Validators.required, Validators.maxLength(140)]],
        shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
        description: [FullDescriptionExample, []],
        tagIds: ['', []]
      });
    }
  }

  public formControls(formControlName: string) {
    return this.projectForm.controls[formControlName];
  }

  public confirm() {
    if (this.isEdition) {
      this.projectsService.update(this.projectForm.getRawValue()).subscribe((editedProject: Project) => {
        this.dialogRef.close(editedProject);
      });
    } else {
      this.projectsService.create(this.projectForm.getRawValue()).subscribe((newProject: Project) => {
        this.dialogRef.close(newProject);
      });
    }
  }
}
