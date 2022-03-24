import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TokenService } from 'src/app/shared/services/token.service';
import { TokenProfile } from 'src/app/shared/models/TokenProfile';
import { EnvironmentConfigurations } from 'src/app/core/models/EnvironmentConfigurations';
import { takeUntil } from 'rxjs/operators';
import { Subject, zip } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LastTokens } from 'src/app/core/models/LastTokens';

@Component({
  selector: 'app-developer-configurations',
  templateUrl: './developer-configurations.component.html',
  styleUrls: ['./developer-configurations.component.less']
})
export class DeveloperConfigurationsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  public feUrl: string;
  public userProfile: TokenProfile;
  public tokensForm: FormGroup;
  public pings: Array<string> = [];
  public lastTokens: LastTokens;

  constructor(
    @Inject('ENVIRONMENT') public feEnvironment: string,
    @Inject('STARTPOINT_API_URL') public startpointApiUrl: string,
    @Inject(DOCUMENT) private document: Document,
    @Inject(MAT_DIALOG_DATA) public configurations: EnvironmentConfigurations,
    private configurationsService: ConfigurationsService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.feUrl = this.document.location.origin;
    this.userProfile = this.tokenService.getTokenProfile();
    const tokens = this.tokenService.getTokens();
    this.tokensForm = this.formBuilder.group({
      token: [tokens.token],
      refreshToken: [tokens.refreshToken]
    });
  }

  resetE2ETestingData() {
    this.configurationsService.initializeE2ETestingData()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  isBeE2EEnvironment() {
    return this.configurations && this.configurations.environment === 'E2e';
  }

  areEnvironmentEquivalent() {
    return this.configurations && this.feEnvironment === this.configurations.environment;
  }

  simplePing() {
    this.configurationsService.sping().subscribe((result: EnvironmentConfigurations) => {
      this.pings.push(`Simple ping: ${result.date}`);
      const tokens = this.tokenService.getTokens();
      this.tokensForm.setValue(tokens);
    });
  }

  doublePing() {
    const req1 = this.configurationsService.sping();
    const req2 = this.configurationsService.sping();
    zip(req1, req2).subscribe((results: Array<EnvironmentConfigurations>) => {
      this.pings.push(`Double pings: ${results[0].date}`);
      const tokens = this.tokenService.getTokens();
      this.tokensForm.setValue(tokens);
    });
  }

  setExpiredToken() {
    const tokens = this.tokenService.getTokens();
    tokens.token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJ1bmlxdWVfbmFtZSI6IjEiLCJlbWFpbCI6ImxhdXJlbnQuYmFiaW5AY2FwZ2VtaW5pLmNvbSIsIm5hbWVpZCI6ImxiYWJpbiIsImlhdCI6IjE1NzA1NTM1ODAiLCJzdWIiOiJLbm93b' +
      'GVkZ2VDZW50ZXJUb2tlbklkIiwianRpIjoiZTQyMThlN2ItMGJmNC00YjAwLWE2YzMtOTJkMDdjOGE5MTBiIiwiUm9sZSI6WyJVU0VSIiwiQURNSU4iLCJNQVRDSF9STSIsIk1BVENIX0' +
      'NBTSIsIk1BVENIX0FETUlOIiwiTUFUQ0hfVVNFUiIsIkNBUExBQl9OSUNFIl0sImV4cCI6MTQ3MzE0NTU4MCwiaXNzIjoiS25vd2xlZGdlQ2VudGVyU2VydmVyIiwiYXVkIjoiS25vd2x' +
      'lZGdlQ2VudGVyQ2xpZW50In0.c4AhjqFkSyD5Llk4dQb9djSt6jBUlIrSIIe_cb2YE0A';
    this.tokenService.setTokens(tokens);
    this.tokensForm.setValue(tokens);
  }

  saveTokens() {
    this.tokenService.setTokens(this.tokensForm.getRawValue());
  }

  getLastTokens() {
    this.configurationsService.getLastTokens().subscribe((lastTokens: LastTokens) => {
      this.lastTokens = lastTokens;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
