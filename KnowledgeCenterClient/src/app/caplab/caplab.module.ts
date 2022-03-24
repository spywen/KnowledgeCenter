import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectLikeDialogComponent } from './projects/dialogs/project-like/project-like-dialog.component';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { ProjectType } from './models/Project';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProjectsService, CaplabProjectsResolver } from './services/projects.service';
import { TagsService } from './services/tags.service';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { ProjectCreateEditDialogComponent } from './projects/dialogs/project-create-edit-dialog/project-create-edit-dialog.component';
import { ProjectDetailsComponent } from './projects/dialogs/project-details/project-details.component';


const routes: Routes = [
  { path: 'projects/proposals',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    data: {
      title: 'Projects',
      type: ProjectType.PROJECTS
    }
  },
  { path: 'projects/proposals/:projectId',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    data: {
      title: 'Projects',
      type: ProjectType.PROJECTS
    }
  },
  { path: 'projects/my',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    data: {
      title: 'My projects',
      type: ProjectType.MY
    }
  },
  { path: 'projects/inprogress',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    data: {
      title: 'In progress projects',
      type: ProjectType.INPROGRESS
    }
  },
  { path: 'projects/finished',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    data: {
      title: 'Projects finished',
      type: ProjectType.FINISHED
    }
  },
  { path: 'projects/administration',
    component: ProjectsComponent,
    resolve: { data: CaplabProjectsResolver },
    canActivate: [AuthGuardService],
    data: {
      title: 'Projects administration',
      acceptedRoles: [ 'CAPLAB_ADMIN' ],
      type: ProjectType.ADMIN
    }
  }
];


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectLikeDialogComponent,
    ProjectCreateEditDialogComponent,
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AngularEditorModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    ProjectCreateEditDialogComponent,
    ProjectLikeDialogComponent,
    DeleteDialogComponent,
    ProjectDetailsComponent
  ],
  providers: [
    ProjectsService,
    CaplabProjectsResolver,
    TagsService
  ],
  exports: [RouterModule],
})
export class CaplabModule { }
