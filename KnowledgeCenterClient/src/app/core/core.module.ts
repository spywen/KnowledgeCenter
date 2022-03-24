import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from '../shared/components/account/account.component';
import { MenuComponent } from './components/menu/menu.component';
import { CoreComponent } from './core.component';
import { SigninComponent } from './components/signin/signin.component';

import { UserResolver, UserService } from '../shared/services/user.service';
import { AgencyResolver, AgencyService } from '../shared/services/agency.service';
import { ServiceLineResolver, ServiceLineService } from '../shared/services/service-line.service';

import { AuthGuardService } from 'src/app/shared/services/auth-guard.service';
import { TooltipService } from '../shared/services/tooltip.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SideMenuComponent } from './components/menu/side-menu/side-menu.component';
import { HomeModule } from '../home/home.module';
import { DeveloperComponent } from './components/developer/developer.component';
import { DeveloperConfigurationsComponent } from './components/developer/developer-configurations/developer-configurations.component';
import { CreditsComponent } from './components/credits/credits.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './components/login/recover-password/recover-password.component';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home' } },
  { path: 'login', component: LoginComponent },
  { path: 'activate', component: LoginComponent },
  { path: 'passwordrecovery', component: RecoverPasswordComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'signin', component: SigninComponent,
    resolve: {
      agencies: AgencyResolver,
      serviceLines: ServiceLineResolver
    }
  },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService],
    data: {
      title: 'Account',
      acceptedRoles: [ 'USER' ]
    },
    resolve: {
      user: UserResolver,
      agencies: AgencyResolver,
      serviceLines: ServiceLineResolver
    }
  },
  {
    path: 'administration',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../administration/administration.module').then(m => m.AdministrationModule),
    data: {
      title: 'Administration',
      acceptedRoles: [ 'ADMIN' ]
    }
  },
  {
    path: 'caplab',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../caplab/caplab.module').then(m => m.CaplabModule),
    data: {
      title: 'CapLab - Nice',
      acceptedRoles: [ 'NICE_COLAB' ]
    }
  },
  {
    path: 'match',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../match/match.module').then(m => m.MatchModule),
    data: {
      acceptedRoles: [ 'MATCH_USER' ]
    }
  },
  {
    path: 'flux',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../flux/flux.module').then(m => m.FluxModule),
    data: {
      acceptedRoles: [ 'NICE_COLAB' ]
    }
  },
  {
    path: 'green',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../green/green.module').then(m => m.GreenModule),
    data: {
      acceptedRoles: [ 'NICE_COLAB' ]
    }
  },
  {
    path: 'whystayhome',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../why-stay-home/why-stay-home.module').then(m => m.WhyStayHomeModule)
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeModule,
    RouterModule.forRoot(
      routes,
      { onSameUrlNavigation: 'reload' }
    )
  ],
  declarations: [
    CoreComponent,
    MenuComponent,
    LoginComponent,
    SigninComponent,
    SideMenuComponent,
    NotFoundComponent,
    DeveloperComponent,
    DeveloperConfigurationsComponent,
    CreditsComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
  ],
  entryComponents: [
    DeveloperConfigurationsComponent,
    CreditsComponent
  ],
  providers: [
    TooltipService,
    AgencyService,
    AgencyResolver,
    ServiceLineService,
    ServiceLineResolver,
    UserService,
    UserResolver
  ],
  exports: [
    RouterModule,
    CoreComponent
  ],
  bootstrap: [CoreComponent]
})
export class CoreModule { }
