import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeveloperConfigurationsComponent } from './developer-configurations/developer-configurations.component';
import { ConfigurationsService } from '../../../shared/services/configurations.service';
import { EnvironmentConfigurations } from '../../models/EnvironmentConfigurations';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum State {
  LOADING,
  OK,
  ERROR,
  WARNING
}

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.less']
})
export class DeveloperComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  public State = State;
  public state: State = State.LOADING;
  public configurations: EnvironmentConfigurations;

  constructor(
    @Inject('DEVELOPER_CONFIG_ENABLED') public developerConfigurationEnabled: boolean,
    @Inject('ENVIRONMENT') public environment: string,
    private dialog: MatDialog,
    private configurationsService: ConfigurationsService) { }

  ngOnInit() {
    this.configurationsService.ping(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe((configurations: EnvironmentConfigurations) => {
        this.configurations = configurations;
        if (this.configurations.environment === this.environment) {
          this.state = State.OK;
        } else {
          this.state = State.WARNING;
        }
      }, () => {
        this.state = State.ERROR;
        this.configurations = null;
      });
  }

  openConfigurations() {
    this.dialog.open(DeveloperConfigurationsComponent, {
      width: '800px',
      data: this.configurations
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
