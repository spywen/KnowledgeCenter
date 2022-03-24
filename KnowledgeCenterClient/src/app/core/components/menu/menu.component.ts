import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivationStart, ActivatedRouteSnapshot, NavigationCancel } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { GoldenThread } from './models/goldenThread';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  @Output() toggleSideMenu = new EventEmitter<boolean>();

  public goldenThread: GoldenThread[] = [];

  constructor(
    public tokenService: TokenService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationStart) {
        this.goldenThread = [];
        if (event.snapshot.data && event.snapshot.data.title) {
          this.getTitles(event.snapshot, this.goldenThread);
          this.goldenThread.reverse();
        }
      } else if (event instanceof NavigationCancel) {
        this.goldenThread = [];
      }
    });
  }

  private getTitles(currentRoute: ActivatedRouteSnapshot, goldenThread: GoldenThread[]) {
    if (currentRoute && currentRoute.data && currentRoute.data.title) {
      if (currentRoute.data.title !== ' ') {
        goldenThread.push({ title: currentRoute.data.title } as GoldenThread);
      }
      return this.getTitles(currentRoute.parent, goldenThread);
    }
  }

  public logout() {
    this.authService.logout().subscribe(() => {
      this.tokenService.removeTokens();
      this.router.navigate(['/']);
    });
  }

  public raiseToggleSideMenuEvent(forceClose: boolean) {
    this.toggleSideMenu.emit(forceClose);
  }
}
