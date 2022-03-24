import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { TokenService } from 'src/app/shared/services/token.service';
import { MatDialog } from '@angular/material';
import { CreditsComponent } from '../../credits/credits.component';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {

  @Output() askForClose = new EventEmitter();

  public currentRoute = '';
  public applicationVersion: string;

  constructor(
    private router: Router,
    public tokenService: TokenService,
    private configuratonService: ConfigurationsService,
    private dialog: MatDialog) {
      this.applicationVersion = this.configuratonService.getVersion();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  route(route: string) {
    this.router.navigate([route]);
    // Wait a little before closing the side menu after clicking to open page
    of(null).pipe(
      delay(100),
      tap(() => this.askForClose.emit()))
    .subscribe();
  }

  public openCredits() {
    this.dialog.open(CreditsComponent, {
      width: '600px'
    });
  }

}
