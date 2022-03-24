import { Component, OnInit, Inject } from '@angular/core';
import { Project, ProjectStatus } from 'src/app/caplab/models/Project';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProjectsService } from 'src/app/caplab/services/projects.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

export class ProjectDetailsParameters {
  project: Project;
  statuses: SimpleEnum[];
}

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.less']
})
export class ProjectDetailsComponent implements OnInit {

  public project: Project;
  public projectStatuses: SimpleEnum[];
  public statusForm: FormGroup;
  public ProjectStatus = ProjectStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ProjectDetailsParameters,
    public tokenService: TokenService,
    private projectsService: ProjectsService,
    private dialogRef: MatDialogRef<ProjectDetailsComponent>,
    private formBuilder: FormBuilder
  ) {
    this.project = this.data.project;
    this.projectStatuses = this.data.statuses;
  }

  ngOnInit() {
    this.statusForm = this.formBuilder.group({
      id: [this.project.id],
      statusId: [this.project.status.id, [Validators.required]]
    });
  }

  public save() {
    const projectId = this.statusForm.get('id').value;
    const statusId = this.statusForm.get('statusId').value;
    this.projectsService.updateProjectStatus(projectId, statusId).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
