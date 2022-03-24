import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Project, ProjectLike } from 'src/app/caplab/models/Project';
import { ProjectsService } from 'src/app/caplab/services/projects.service';

export interface ProjectLikeDialogCloseResponse {
  wasFirstLike: boolean;
  rate: number;
  oldRate: number;
}

@Component({
  selector: 'app-project-like-dialog',
  templateUrl: './project-like-dialog.component.html',
  styleUrls: ['./project-like-dialog.component.less']
})
export class ProjectLikeDialogComponent implements OnInit {

  public project: Project;
  private wasFirstLike = true;
  private oldRate: number;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ProjectLikeDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Project,
    private projectsService: ProjectsService) {
      this.project = data;
      if (this.project.myLike) {
        this.wasFirstLike = false;
      } else {
        this.project.myLike = { rate: 0 } as ProjectLike;
      }
      this.oldRate = data.myLike.rate;
    }

  ngOnInit() { }

  public confirm() {
    this.projectsService.rateProject(this.project.id, this.project.myLike.rate).subscribe(() => {
    this.bottomSheetRef.dismiss({
      wasFirstLike: this.wasFirstLike,
      rate: this.project.myLike.rate,
      oldRate: this.oldRate
    } as ProjectLikeDialogCloseResponse);
  });
  }

}
