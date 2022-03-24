import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatchComponent } from './match.component';
import { MatchCollaboratorsComponent } from './components/match-collaborators/match-collaborators.component';
import { MatchOffersComponent } from './components/match-offers/match-offers.component';
import { MatchSkillsComponent } from './components/match-skills/match-skills.component';
import {
  MatchSkillsCreateDialogComponent
} from './components/match-skills/dialogs/match-skills-create-dialog/match-skills-create-dialog.component';
import {
  MatchSkillsEditDialogComponent
} from './components/match-skills/dialogs/match-skills-edit-dialog/match-skills-edit-dialog.component';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';
import { SkillResolver, SkillService } from './services/skill.service';
import { ServiceLineResolver, ServiceLineService } from '../shared/services/service-line.service';
import {
  MatchCollaboratorsSideListComponent
} from './components/match-collaborators/match-collaborators-side-list/match-collaborators-side-list.component';
import { CollaboratorsResolver, CollaboratorsService } from './services/collaborators.service';
import {
  MatchCollaboratorComponent
} from './components/match-collaborators/dialogs/match-user-to-collaborator-dialog/match-collaborator.component';
import { AgencyResolver, AgencyService } from '../shared/services/agency.service';
import { SkillLevelService } from './services/skill-level.service';
import {
  MatchCollaboratorsSkillEditDialogComponent
} from './components/match-collaborators/dialogs/match-collaborators-skill-edit-dialog/match-collaborators-skill-edit-dialog.component';
import { MatchCustomersComponent } from './components/match-customers/match-customers.component';
import { CustomersResolver, CustomersService } from './services/customers.service';
import {
  MatchCustomerCreateDialogComponent
} from './components/match-customers/dialogs/match-customer-create-dialog/match-customer-create-dialog.component';
import {
  MatchCustomerEditDialogComponent
} from './components/match-customers/dialogs/match-customer-edit-dialog/match-customer-edit-dialog.component';
import {
  MatchCustomerSitesDialogComponent
} from './components/match-customers/dialogs/match-customer-sites-dialog/match-customer-sites-dialog.component';
import {
  MatchCustomerSiteEditDialogComponent
} from './components/match-customers/dialogs/match-customer-sites-dialog/match-customer-site-edit-dialog/match-customer-site-edit-dialog.component';
import { CustomerOfferResolver, OfferService } from './services/offer.service';
import { CustomerOfferStatusService } from './services/customer-offer-status.service';
import { MatchOffersSideListComponent } from './components/match-offers/match-offers-side-list/match-offers-side-list.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { RoleService } from '../shared/services/role.service';
import { MatchOffersSkillEditDialogComponent } from './components/match-offers/dialogs/match-offers-skill-edit-dialog/match-offers-skill-edit-dialog.component';
import { MatchOffersChangesDetectedDialogComponent } from './components/match-offers/dialogs/match-offers-changes-detected-dialog/match-offers-changes-detected-dialog.component';

const routes: Routes = [
  {
    path: '',
    data: {title: 'Match'},
    component: MatchComponent,
    children: [
      {
        path: 'offers',
        data: {title: 'Offers'},
        component: MatchOffersComponent,
        resolve: {customerOfferResolverResults: CustomerOfferResolver}
      },
      {
        path: 'collaborators',
        data: {title: 'Collaborators'},
        component: MatchCollaboratorsComponent,
        resolve: {collaboratorResolverResults: CollaboratorsResolver}
      },
      {
        path: 'skills',
        data: {title: 'Skills'},
        resolve: {
          skills: SkillResolver,
          serviceLines: ServiceLineResolver
        },
        component: MatchSkillsComponent
      },
      {
        path: 'customers',
        data: {title: 'Customers'},
        resolve: {customersResolverResult: CustomersResolver},
        component: MatchCustomersComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    MatchComponent,
    MatchCollaboratorsComponent,
    MatchSkillsComponent,
    MatchSkillsCreateDialogComponent,
    MatchSkillsEditDialogComponent,
    MatchCollaboratorsSideListComponent,
    MatchCollaboratorComponent,
    MatchCollaboratorsSkillEditDialogComponent,
    MatchCustomersComponent,
    MatchCustomerCreateDialogComponent,
    MatchCustomerEditDialogComponent,
    MatchCustomerSitesDialogComponent,
    MatchCustomerSiteEditDialogComponent,
    MatchOffersComponent,
    MatchOffersSideListComponent,
    MatchOffersSkillEditDialogComponent,
    MatchOffersChangesDetectedDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule
  ],
  entryComponents: [
    MatchSkillsCreateDialogComponent,
    MatchCollaboratorsComponent,
    MatchSkillsEditDialogComponent,
    DeleteDialogComponent,
    MatchCollaboratorComponent,
    MatchCollaboratorsSkillEditDialogComponent,
    MatchCustomerCreateDialogComponent,
    MatchCustomerEditDialogComponent,
    MatchCustomerSitesDialogComponent,
    MatchCustomerSiteEditDialogComponent,
    MatchOffersComponent,
    MatchOffersSkillEditDialogComponent,
    MatchOffersChangesDetectedDialogComponent
  ],
  providers: [
    SkillService,
    SkillResolver,
    ServiceLineService,
    ServiceLineResolver,
    SkillLevelService,
    CollaboratorsService,
    CollaboratorsResolver,
    AgencyService,
    AgencyResolver,
    CustomersService,
    CustomersResolver,
    CustomerOfferResolver,
    OfferService,
    CustomerOfferStatusService,
    RoleService
  ],
  exports: [RouterModule]
})
export class MatchModule {
}
