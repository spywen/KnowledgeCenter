import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { CovidStatsResponse } from './models/CovidStats';
import { Country } from '../shared/models/Country';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CovidService } from './services/covid.service';
import { BasePaginationRequest } from '../shared/models/BasePagination';
import { CovidStatsFilters } from './models/CovidStatsFilters';
import { MatOptionSelectionChange } from '@angular/material';
import { TooltipService } from '../shared/services/tooltip.service';

@Component({
  selector: 'app-why-stay-home',
  templateUrl: './why-stay-home.component.html',
  styleUrls: ['./why-stay-home.component.less']
})
export class WhyStayHomeComponent implements OnInit {

  @ViewChild('tooMuchCountriesMessage', { static: true })
  public tooMuchCountriesMessageTemplate: TemplateRef<any>;

  public covidStatsResponse: CovidStatsResponse;
  public countries: Country[];
  public type = 'total';

  public statsForm: FormGroup;

  public chartOptions: (ChartOptions) = {
    responsive: true,
    elements: {
      line: {
        tension: 0
      }
    },
    scales: {
      yAxes: [{
        ticks: {
            beginAtZero: true
        }
      }]
    }
  };
  public colors = ['#E53935', '#8E24AA', '#64B5F6', '#2E7D32', '#3949AB', '#FFD600', '#26A69A', '#FF8F00', '#8D6E63', '#546E7A'];
  public chartColors = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private covidService: CovidService,
    private tooltipService: TooltipService
  ) {
    this.statsForm = this.formBuilder.group({
      countryCodes: [['fr', 'it', 'es', 'cn'], [Validators.required]]
    });

    this.chartColors = this.colors.map(color => {
      return {
        backgroundColor: color + '30',
        borderColor: color,
        pointBackgroundColor: color + 'cc',
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: color
      };
    });

    this.route.data.subscribe(data => {
      this.covidStatsResponse = data.data as CovidStatsResponse;
      this.countries = data.countries;
    });
  }

  ngOnInit() {
  }

  public search() {
    const filters = { filters: { countryCodes: this.statsForm.get('countryCodes').value }} as BasePaginationRequest<CovidStatsFilters>;
    this.covidService.getStats(filters).subscribe((result: CovidStatsResponse) => {
      this.covidStatsResponse = result;
    });
  }

  public clear() {
    this.statsForm.patchValue({countryCodes: []});
  }

  public countriesChanged(e: MatOptionSelectionChange) {
    if (e.isUserInput && e.source.selected) {
      if (this.statsForm.get('countryCodes').value.length > 10) {
        e.source.deselect();
        this.tooltipService.warning(this.tooMuchCountriesMessageTemplate);
      }
    }
  }
}
