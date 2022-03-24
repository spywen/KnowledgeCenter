import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './token.service';
import { SharedModule } from '../shared.module';

@Injectable({
  providedIn: SharedModule
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private tokenService: TokenService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const acceptedRoles = route.data.acceptedRoles;

    if (!acceptedRoles) {
      return true;
    }

    if (this.tokenService.isAuthenticated()) {
      if (this.tokenService.hasOneOfRoles(acceptedRoles)) {
        return true;
      } else {
        return false;
      }
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }

}
