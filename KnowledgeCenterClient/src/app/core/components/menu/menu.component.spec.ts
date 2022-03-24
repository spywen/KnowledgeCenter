import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'src/app/shared/services/token.service';
import { Router } from '@angular/router';
import { DeveloperComponent } from '../developer/developer.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { of } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent, DeveloperComponent ],
      imports: [
        SharedModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: {
          logout: () => of(true)
        }},
        { provide: TokenService, useValue: {
          removeTokens: () => {},
          isAuthenticated: () => true,
          hasOneOfRoles: () => {},
          getTokenProfile: () => ({ login: 'bob' }),
          getGravatar: () => ''
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove token and redirect to home when click on logout', () => {
    const tokenServiceSpy = spyOn(TestBed.get(TokenService), 'removeTokens');
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');

    component.logout();

    expect(tokenServiceSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should emit togle side menu event when click on side-menu button', () => {
    const toggleSideMenuEventSpy = spyOn(component.toggleSideMenu, 'emit');

    element.querySelector<HTMLButtonElement>('.open-side-menu').click();

    expect(toggleSideMenuEventSpy).toHaveBeenCalled();
  });

});
