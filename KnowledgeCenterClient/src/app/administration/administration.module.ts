import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ServiceLineComponent } from './service-line/service-line.component';
import { AgencyComponent } from './agency/agency.component';
import { AgencyService, AgencyResolver } from '../shared/services/agency.service';
import { ServiceLineService, ServiceLineResolver } from '../shared/services/service-line.service';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { AgencyCreateDialogComponent } from './agency/dialogs/agency-create-dialog/agency-create-dialog.component';
import { AgencyEditDialogComponent } from './agency/dialogs/agency-edit-dialog/agency-edit-dialog.component';
import { ServiceLineCreateDialogComponent } from './service-line/dialogs/service-line-create-dialog/service-line-create-dialog.component';
import { ServiceLineEditDialogComponent } from './service-line/dialogs/service-line-edit-dialog/service-line-edit-dialog.component';
import { UsersComponent } from './users/users.component';
import { AccountComponent } from '../shared/components/account/account.component';
import { UserResolver, UserService, UsersResolver } from '../shared/services/user.service';
import { RoleService } from '../shared/services/role.service';
import { RolesDialogComponent } from './users/dialogs/roles/roles-dialog.component';

const routes: Routes = [
  { path: 'agencies', component: AgencyComponent,
    data: {
      title: 'Agencies'
    },
    resolve: {
      agencies: AgencyResolver
    }
  },
  { path: 'service-lines', component: ServiceLineComponent,
    data: {
      title: 'Service lines'
    },
    resolve: {
      serviceLines: ServiceLineResolver
    }
  },
  { path: 'users', data: { title: ' ' },
    children: [
      { path: '', component: UsersComponent, data: { title: 'Users' }, resolve : {users : UsersResolver}},
      { path: ':id/account', component: AccountComponent,
        data: { title: 'Account' },
        resolve: {
          user: UserResolver,
          agencies: AgencyResolver,
          serviceLines: ServiceLineResolver
        }
      }
    ]
  },
];

@NgModule({
  declarations: [
    ServiceLineComponent,
    AgencyComponent,
    AgencyCreateDialogComponent,
    AgencyEditDialogComponent,
    ServiceLineCreateDialogComponent,
    ServiceLineEditDialogComponent,
    UsersComponent,
    RolesDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    DeleteDialogComponent,
    AgencyCreateDialogComponent,
    AgencyEditDialogComponent,
    ServiceLineCreateDialogComponent,
    ServiceLineEditDialogComponent,
    UsersComponent,
    RolesDialogComponent
  ],
  providers: [
    AgencyService,
    AgencyResolver,
    ServiceLineService,
    ServiceLineResolver,
    UserService,
    UserResolver,
    UsersResolver,
    RoleService
  ],
  exports: [RouterModule]
})
export class AdministrationModule { }
