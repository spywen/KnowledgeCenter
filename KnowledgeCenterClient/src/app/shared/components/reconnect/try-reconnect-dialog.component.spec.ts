import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TryReconnectDialogComponent } from './try-reconnect-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { TokenService } from 'src/app/shared/services/token.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Tokens } from '../../models/Tokens';

describe('TryReconnectDialogComponent', () => {
  let component: TryReconnectDialogComponent;
  let fixture: ComponentFixture<TryReconnectDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TryReconnectDialogComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: AuthService, useValue: { login: () => {} }},
        {provide: TokenService, useValue: { setTokens: () => {} }},
        {provide: MatDialogRef, useValue: { close: () => {} }},
        {provide: MAT_DIALOG_DATA, useValue: { login: 'toto', password: ''}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TryReconnectDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display message with login, empty password and log in button should be disabled', () => {
    expect(element.querySelectorAll<HTMLParagraphElement>('p')[0].textContent)
      .toBe('toto, please enter your password to unlock the application');
    expect(component.reconnectForm.get('login').value).toBe('toto');
    expect(component.reconnectForm.get('password').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('should close popup when click on logout button by indicating that we did not login with false', () => {
    const closeSpy = spyOn(TestBed.get(MatDialogRef), 'close');

    component.logout();

    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('when authentification failed should reset password', () => {
    const invalidPassword = 'invalidPassword';
    component.reconnectForm.get('password').setValue(invalidPassword);
    expect(component.reconnectForm.get('password').value).toBe(invalidPassword);
    spyOn(TestBed.get(AuthService), 'login').and.returnValue(throwError('error'));

    component.tryLogin();

    expect(component.reconnectForm.get('password').value).toBe('');
  });

  it('when authorization succeed should set token and close popup by indicating that we are logged in with true', () => {
    const password = 'Pa$$w0rd';
    const tokens = { refreshToken: '[REFRESHTOKEN]', token: '[TOKEN]' } as Tokens;
    component.reconnectForm.get('password').setValue(password);
    expect(component.reconnectForm.get('password').value).toBe(password);
    spyOn(TestBed.get(AuthService), 'login').and.returnValue(of(tokens));
    const closeSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    const setTokensSpy = spyOn(TestBed.get(TokenService), 'setTokens');

    component.tryLogin();

    expect(setTokensSpy).toHaveBeenCalledWith(tokens);
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

});
