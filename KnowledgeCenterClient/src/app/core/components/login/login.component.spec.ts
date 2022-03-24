import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/shared/services/user.service';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                ReactiveFormsModule,
                SharedModule,
                RouterTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: { login: () => { } } },
                { provide: TokenService, useValue: { setTokens: () => { } } },
                { provide: TooltipService, useValue: { info: () => { } } },
                { provide: ActivatedRoute, useValue: { queryParams: of(({})), params: of({}) } },
                { provide: UserService, useValue: { activate: (token: string) => of('jdoe') } }

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initially display empty form and log in button should be disabled', () => {
        expect(component.loginForm.get('login').value).toBe('');
        expect(component.loginForm.get('password').value).toBe('');
        expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no login', () => {
        updateForm('', 'myPassword!');
        fixture.detectChanges();

        expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no password', () => {
        updateForm('me', '');
        fixture.detectChanges();

        expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be enabled when login and password are defined', () => {
        updateForm('me', 'myPassword!');
        fixture.detectChanges();

        expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
    });

    it('button should be enabled when login and password are defined', () => {
        updateForm('me', 'myPassword!');
        fixture.detectChanges();

        expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
    });

    it('when login failed should reset password', () => {
        spyOn(TestBed.get(AuthService), 'login').and.returnValue(throwError('error'));

        updateForm('me', 'myPassword!');
        fixture.detectChanges();
        component.login();

        expect(component.loginForm.get('password').value).toBe('');
    });

    it('when login succeed should set token and redirect to home page', () => {
        const token = '[TOKEN]';
        spyOn(TestBed.get(AuthService), 'login').and.returnValue(of(token));
        const tokenServiceSpy = spyOn(TestBed.get(TokenService), 'setTokens');
        const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');

        updateForm('me', 'myPassword!');
        fixture.detectChanges();
        component.login();

        expect(tokenServiceSpy).toHaveBeenCalledWith(token);
        expect(routerSpy).toHaveBeenCalledWith('/');
    });

    it('when login succeed should set token and redirect to shared project page', () => {
        const token = '[TOKEN]';
        spyOn(TestBed.get(AuthService), 'login').and.returnValue(of(token));
        const tokenServiceSpy = spyOn(TestBed.get(TokenService), 'setTokens');
        const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
        const route = TestBed.get(ActivatedRoute);
        route.queryParams = of({ returnUrl: '/projects/public/21' });

        updateForm('me', 'myPassword!');
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.login();

        expect(tokenServiceSpy).toHaveBeenCalledWith(token);
        expect(routerSpy).toHaveBeenCalledWith('/projects/public/21');
    });

    it('when did not just signed in, should not display success message', (() => {
        const tooltipServiceSpy = spyOn(TestBed.get(TooltipService), 'info');

        fixture = TestBed.createComponent(LoginComponent);
        fixture.detectChanges();

        expect(tooltipServiceSpy).not.toHaveBeenCalled();
    }));

    it('when just signed in, should display success message', (() => {
        const route = TestBed.get(ActivatedRoute);
        route.queryParams = of({ justSignedIn: true });
        const tooltipServiceSpy = spyOn(TestBed.get(TooltipService), 'info');

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(tooltipServiceSpy).toHaveBeenCalledWith(component.justSignedInTemplate);
    }));

    it('when user is successfully activating his account should patch login form and display tooltip', (() => {
        const route = TestBed.get(ActivatedRoute);
        route.queryParams = of({ token: 'ABC' });
        const tooltipServiceSpy = spyOn(TestBed.get(TooltipService), 'info');

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.loginForm.get('login').value).toBe('jdoe');
        expect(tooltipServiceSpy).toHaveBeenCalledWith(component.accountActivatedTemplate);
    }));

    function updateForm(login, password) {
        component.loginForm.controls.login.setValue(login);
        component.loginForm.controls.password.setValue(password);
    }
});
