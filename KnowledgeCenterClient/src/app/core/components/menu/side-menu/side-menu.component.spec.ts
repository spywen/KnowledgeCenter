import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SideMenuComponent } from './side-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenService } from 'src/app/shared/services/token.service';
import { MatDialog } from '@angular/material';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let element: HTMLElement;

  const mockUserRole = (userRoles: string[]) => {
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.callFake((requiredRoles: string[]) => {
      let isAllowed = false;
      requiredRoles.forEach(requiredRole => {
        if (userRoles.includes(requiredRole)) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ SideMenuComponent ],
      providers: [
        { provide: TokenService, useValue: { hasOneOfRoles: () => true } }, // ADMIN
        { provide: MatDialog, useValue: { open: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route and emit event to close side menu when click on menu item', fakeAsync(() => {
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    const askForCloseEventSpy = spyOn(component.askForClose, 'emit');

    element.querySelector<HTMLElement>('.home').click();

    expect(routerSpy).toHaveBeenCalledWith(['/']);
    tick(200);
    expect(askForCloseEventSpy).toHaveBeenCalled();
  }));

  it('should display administration module when user is admin', (() => {
    mockUserRole(['ADMIN']);

    fixture.detectChanges();
    expect(element.querySelector('.administration')).not.toBeNull();
  }));

  it('should not display administration module when user is not admin', (() => {
    mockUserRole(['USER']);

    fixture.detectChanges();
    expect(element.querySelector('.administration')).toBeNull();
  }));


  it('should display Match module when user is match_user', (() => {
    mockUserRole(['MATCH_USER']);

    fixture.detectChanges();
    expect(element.querySelector('.match')).not.toBeNull();
  }));

  it('should not display Match module when user is not match_user', (() => {
    mockUserRole(['USER']);

    fixture.detectChanges();
    expect(element.querySelector('.match')).toBeNull();
  }));
});
