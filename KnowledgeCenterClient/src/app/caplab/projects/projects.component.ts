import { Component, OnInit } from '@angular/core';
import { Project, ProjectStatus, ProjectType, ProjectFilters, ProjectLike } from '../models/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollEventsService } from 'src/app/shared/events/scroll-events.service';
import { BasePaginationRequest, BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ProjectLikeDialogComponent, ProjectLikeDialogCloseResponse } from './dialogs/project-like/project-like-dialog.component';
import { ProjectsService, DEFAULT_CAPLAB_PROJECTS_PER_PAGE } from '../services/projects.service';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { DeleteDialogComponent, DeleteParameters } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { ProjectCreateEditDialogComponent, ProjectDialogParameters } from './dialogs/project-create-edit-dialog/project-create-edit-dialog.component';
import { ProjectDetailsComponent, ProjectDetailsParameters } from './dialogs/project-details/project-details.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LoadProjectsObjectResolver } from '../models/LoadProjects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {

  public filterForm: FormGroup;
  public projects: Array<Project>;
  public projectStatuses: Array<SimpleEnum>;
  public tags: Array<SimpleEnum>;
  public isOnlyMyProjects = false;
  public currentProjectType: ProjectType;

  public ProjectType = ProjectType;
  public ProjectStatus = ProjectStatus;

  private currentPage = 1;
  private lastPageNumber = 1;
  private filterChanged = new Subject<string>();
  private orderByMostRecent = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scrollEventsService: ScrollEventsService,
    private projectsService: ProjectsService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      filter: [''],
      orderBy: ['recent']
    });

    this.route.data.subscribe(data => {
      this.currentProjectType = data.type as ProjectType;
      const dataResolved: LoadProjectsObjectResolver = data.data;
      this.lastPageNumber = dataResolved.projectsResponse.totalPages;
      this.projects = dataResolved.projectsResponse.data;
      this.tags = dataResolved.tags;
      this.projectStatuses = dataResolved.projectStatuses;
    });

    this.route.paramMap.subscribe(params => {
      const projectId = params.get('projectId');

      if (projectId !== null) {
        this.openProjectDetailsPopup(projectId);
      }
    });

    this.filterChanged.pipe(
      debounceTime(1000),
      map((keyword) => {
        return this.getProjects(true, keyword);
      }))
      .subscribe(() => {});
  }

  ngOnInit() {
    this.scrollEventsService.listenScrollDown().subscribe(() => {
      if (this.currentPage + 1 > this.lastPageNumber) {
        return;
      }
      this.currentPage++;
      this.getProjects(false);
    });
  }

  public applyFilter(filterValue: string) {
    this.filterChanged.next(filterValue);
  }

  public orderBy(event: any) {
    if (event.value === 'popular') {
      this.orderByMostRecent = false;
    } else {
      this.orderByMostRecent = true;
    }
    this.getProjects(true);
  }

  public add() {
    const dialogRefAdd = this.dialog.open(ProjectCreateEditDialogComponent, {
      width: '750px',
      data: {
        tags: this.tags
      } as ProjectDialogParameters
    });

    dialogRefAdd.afterClosed().subscribe((newProject: Project) => {
      if (!newProject) {
        return;
      }
      switch (this.currentProjectType) {
        case ProjectType.MY:
          this.projects.unshift(newProject);
          break;
        default:
          this.router.navigate(['/caplab/projects/my']);
          break;
      }
    });
  }

  public edit(project: Project) {
    const dialogRefAdd = this.dialog.open(ProjectCreateEditDialogComponent, {
      width: '750px',
      data: {
        tags: this.tags,
        project
      } as ProjectDialogParameters
    });

    dialogRefAdd.afterClosed().subscribe((editedProject: Project) => {
      if (editedProject) {
        const element = this.projects.find(x => x.id === project.id);
        element.title = editedProject.title;
        element.shortDescription = editedProject.shortDescription;
        element.description = editedProject.description;
        element.tags = editedProject.tags;
        element.status = editedProject.status;
      }
    });
  }

  private getProjects(shouldResetPagination: boolean, keyword: string = '') {
    if (shouldResetPagination) {
      this.currentPage = 1;
    }

    const query = {
      page: this.currentPage,
      size: DEFAULT_CAPLAB_PROJECTS_PER_PAGE,
      filters: { keyword, orderByDescendingCreationDate: this.orderByMostRecent } as ProjectFilters
    } as BasePaginationRequest<ProjectFilters>;
    switch (this.currentProjectType) {
      case ProjectType.PROJECTS:
        query.filters.statusCodes = [ProjectStatus.VALIDATED];
        break;
      case ProjectType.MY:
        query.filters.isOnlyMine = true;
        break;
      case ProjectType.ADMIN:
        query.filters.statusCodes = [ProjectStatus.WAITING];
        break;
      case ProjectType.INPROGRESS:
        query.filters.statusCodes = [ProjectStatus.INPROGRESS];
        break;
      case ProjectType.FINISHED:
        query.filters.statusCodes = [ProjectStatus.FINISHED];
        break;
    }

    this.projectsService.getProjects(query).subscribe((response: BasePaginationResponse<Project[]>) => {
      this.lastPageNumber = response.totalPages;

      if (shouldResetPagination) {
        this.projects = response.data;
      } else {
        response.data.forEach(project => {
          this.projects.push(project);
        });
      }
    });
  }

  public toggleProjectOwnership(event) {
    this.isOnlyMyProjects = event.checked;
    this.getProjects(true);
  }

  public rate(project: Project) {
    this.projectsService.get(project.id).subscribe(fullProject => {
      const bottomSHeetRef = this.bottomSheet.open(ProjectLikeDialogComponent, {
        data: fullProject
      });

      bottomSHeetRef.afterDismissed().subscribe((response: ProjectLikeDialogCloseResponse) => {
        if (response) {
          if (response.wasFirstLike) {
            if (project.likeCount === 0) {
              project.likeAverageRate = response.rate;
            } else {
              project.likeAverageRate = project.likeAverageRate + ((response.rate - project.likeAverageRate) / project.likeCount);
            }
            project.likeCount++;
          } else {
            if (project.likeCount === 1) {
              project.likeAverageRate = response.rate;
            } else {
              project.likeAverageRate = ((project.likeAverageRate * project.likeCount) - response.oldRate) / (project.likeCount - 1); // Remove old rate
              project.likeAverageRate = project.likeAverageRate + ((response.rate - project.likeAverageRate) / project.likeCount); // Add new rate
            }
          }
          project.myLike = { rate: response.rate } as ProjectLike;
          this.projects[this.projects.findIndex(y => y.id === project.id)] = project;
        }
      });
    });
  }

  public delete(project: Project) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'project',
        name: project.title,
        elementId: project.id,
        deleteAction: this.projectsService.delete(project.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.projects.indexOf(project);
        this.projects.splice(index, 1);
      }
    });
  }

  public open(project: Project) {
    const dialogRef = this.dialog.open(ProjectDetailsComponent, {
      width: '750px',
      data: {
        project,
        statuses : this.projectStatuses
      } as ProjectDetailsParameters
    });

    dialogRef.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getProjects(true);
      }
    });
  }

  private openProjectDetailsPopup(projectId: string) {
    this.projectsService.get(parseInt(projectId, 10)).subscribe(selectedProject => {
      this.open(selectedProject);
    });
  }
}
