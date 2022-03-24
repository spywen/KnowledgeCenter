import { Directive, OnInit, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { TokenService } from '../services/token.service';

/**
 * This directive can be used with any html tag like that: *appHasOneRoles="['ROLE1', 'ROLE2']"
 * and will display the html element only if user has at least one of defined roles
 * Moreover, and because we can't cumulate 'structural' directives (like *ngIf, *ngFor, etc... VS attribute directive like [ngStyle]):
 * you can add to the list of roles -> some booleans if at least one boolean is TRUE (typed): the html element will be displayed.
 * Ex: *appHasOneRoles="['ROLE1', 'ROLE2', publication.isOwner]" (by considering that publication.isOwner is a boolean)
 */
@Directive({
  selector: '[appHasOneOfRoles]'
})
export class HasOneRolesOfDirective implements OnInit {
  @Input() appHasOneOfRoles: any[];

  isVisible = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private tokenService: TokenService
  ) {}

  ngOnInit() {

    if (this.appHasOneOfRoles.some(x => x === true) || this.tokenService.hasOneOfRoles(this.appHasOneOfRoles)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
