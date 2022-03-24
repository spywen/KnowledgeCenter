import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationComponent } from './administration/administration.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { ArdoiseComponent } from './ardoise/ardoise.component';
import { GreenPublicationsResolver, GreenArdoiseResolver, PublicationsService, GreenArdoisePreviewResolver } from './services/publications.service';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PublicationCreateEditDialogComponent } from './dialogs/publication-create-edit-dialog/publication-create-edit-dialog.component';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';



const routes: Routes = [
  { path: 'ardoise',
    component: ArdoiseComponent,
    resolve: { publication: GreenArdoiseResolver },
    data: {
      title: 'Ardoise de la semaine'
    }
  },
  { path: 'ardoise/:publicationId',
    component: ArdoiseComponent,
    resolve: { publication: GreenArdoisePreviewResolver },
    canActivate: [AuthGuardService],
    data: {
      title: 'Ardoise de la semaine',
      acceptedRoles: [ 'GREEN_ADMIN' ]
    }
  },
  { path: 'administration',
    component: AdministrationComponent,
    resolve: { loadPublicationsObjectResolver: GreenPublicationsResolver },
    canActivate: [AuthGuardService],
    data: {
      title: 'Administration',
      acceptedRoles: [ 'GREEN_ADMIN' ]
    }
  }
];

@NgModule({
  declarations: [
    AdministrationComponent,
    ArdoiseComponent,
    PublicationCreateEditDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  providers: [
    PublicationsService,
    GreenPublicationsResolver,
    GreenArdoiseResolver,
    GreenArdoisePreviewResolver
  ],
  exports: [RouterModule],
  entryComponents: [
    PublicationCreateEditDialogComponent,
    DeleteDialogComponent
  ]
})
export class GreenModule { }
