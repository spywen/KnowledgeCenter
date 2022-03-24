import { TestBed, async, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { StatusEventsService } from '../shared/events/status-events-service';
import { MenuComponent } from './components/menu/menu.component';
import { BehaviorSubject } from 'rxjs';
import { SideMenuComponent } from './components/menu/side-menu/side-menu.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './core.module';
import { LoginComponent } from './components/login/login.component';
import { SigninComponent } from './components/signin/signin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeveloperComponent } from './components/developer/developer.component';
import { RecoverPasswordComponent } from './components/login/recover-password/recover-password.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { HomeComponent } from '../home/home.component';

fdescribe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let element: HTMLElement;
  let router: Router;
  let location: Location;

  const requestOnAirSubject = new BehaviorSubject(false);
  const routingOnAir = new BehaviorSubject(false);
  const connectionStatus = new BehaviorSubject(true);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CoreComponent,
        MenuComponent,
        SideMenuComponent,
        LoginComponent,
        SigninComponent,
        NotFoundComponent,
        DeveloperComponent,
        RecoverPasswordComponent,
        ForgotPasswordComponent,
        HomeComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: StatusEventsService, useValue: {
          getHttpStatus: () => requestOnAirSubject.asObservable(),
          getRoutingStatus: () => routingOnAir.asObservable(),
          setRoutingStatus: () => {},
          getConnectionStatus: () => connectionStatus.asObservable(),
          setConnectionStatus: () => {},
        }}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display loader when there is no activity', () => {
    requestOnAirSubject.next(false);
    routingOnAir.next(false);

    fixture.detectChanges();

    expect(element.querySelector<HTMLDivElement>('.loader').hidden).toBeTruthy();
  });

  it('should display loader when there is an http activity', () => {
    requestOnAirSubject.next(true);
    routingOnAir.next(false);

    fixture.detectChanges();

    expect(element.querySelector<HTMLDivElement>('.loader').hidden).toBeFalsy();
  });

  it('should display loader when there is a routing activity', () => {
    requestOnAirSubject.next(false);
    routingOnAir.next(true);

    fixture.detectChanges();

    expect(element.querySelector<HTMLDivElement>('.loader').hidden).toBeFalsy();
  });

  it('navigate to unknown page should redirects you to 404', fakeAsync(() => {
    const setRoutingStatusSpy = spyOn(TestBed.get(StatusEventsService), 'setRoutingStatus');
    router.navigate(['unknwon']).then(() => {
      expect(location.path()).toBe('/404');
      expect(setRoutingStatusSpy).toHaveBeenCalledWith(true);
      expect(setRoutingStatusSpy).toHaveBeenCalledWith(false);
    });
  }));
});
