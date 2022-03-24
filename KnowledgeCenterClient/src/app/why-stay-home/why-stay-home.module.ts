import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { WhyStayHomeComponent } from './why-stay-home.component';
import { CovidStatsResolver, CovidService } from './services/covid.service';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonService, CountryResolver } from '../shared/services/common.service';

const routes: Routes = [
  { path: '',
    component: WhyStayHomeComponent,
    data: {
      title: 'Why stay at home?'
    },
    resolve: {
      data: CovidStatsResolver,
      countries: CountryResolver
    }
  }
];

@NgModule({
  entryComponents: [WhyStayHomeComponent],
  declarations: [WhyStayHomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ChartsModule,
    FormsModule
  ],
  exports: [RouterModule],
  providers: [
    CovidStatsResolver,
    CovidService,
    CommonService,
    CountryResolver
  ]
})
export class WhyStayHomeModule { }
