import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../shared/services/user.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Agency } from '../../../shared/models/Agency';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { User } from '../../../shared/models/User';
import { Component, Input } from '@angular/core';
import {  MatFormFieldModule, MatAutocompleteModule, MatSelectModule, MatInputModule } from '@angular/material';

@Component({
  selector: 'app-recaptcha',
  template: '<p>RECAPTCHA</p>'
})
class MockRecaptchaComponent {
  @Input() parentForm: FormGroup;
}

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let element: HTMLElement;

  const agencies = [{
    id: 26,
    name: 'Brest',
    postalCode: '29200'
  }] as Agency[];
  const serviceLines = [{
    id: 5,
    name: 'DIT',
    description: 'Digital Innovation And Transformation'
  }] as ServiceLine[];

  const defaultUser = {
    firstname: 'bob',
    lastname: 'doe',
    login: 'bdoe',
    email: 'bob.doe@capgemini.com',
    agency: agencies[0],
    serviceLine: serviceLines[0],
    isActive: true,
    passwordTryCount: 0,
    fullname: 'bob doe'
  } as User;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninComponent, MockRecaptchaComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: { signIn: () => of(defaultUser) }},
        { provide: ActivatedRoute, useValue: { data: of({agencies, serviceLines}) } },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display empty form and sign in button should be disabled', () => {
    expect(component.signinForm.get('firstname').value).toBe('');
    expect(component.signinForm.get('lastname').value).toBe('');
    expect(component.signinForm.get('login').value).toBe('');
    expect(component.signinForm.get('email').value).toBe('');

    expect(component.signinForm.get('agency').value).toBe('');
    expect(component.signinForm.get('serviceLineId').value).toBe('');

    expect(component.signinForm.get('newPassword').value).toBe('');
    expect(component.signinForm.get('newPasswordConfirmation').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('when signin succeed should redirect to login page', () => {
    spyOn(TestBed.get(UserService), 'signIn').and.returnValue(of({}));
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');

    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcd', 'Brest', 5);
    fixture.detectChanges();
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeFalsy();
    component.signin();

    expect(routerSpy).toHaveBeenCalledWith(['login'], { queryParams: { justSignedIn: true } });
  });

  it('should display error message when firstname not provided', () => {
    updateForm('', 'doe', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('firstname', 'This field is mandatory');
  });

  it('should display error message when lastname not provided', () => {
    updateForm('bob', '', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('lastname', 'This field is mandatory');
  });

  it('should display error message when login not provided', () => {
    updateForm('bob', 'doe', '', 'bob.doe@capgemini.com', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('login', 'This field is mandatory');
  });

  it('should display error message when email not provided', () => {
    updateForm('bob', 'doe', 'bdoe', '', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('email', 'This field is mandatory');
  });

  it('should display error message when email is invalid', () => {
    updateForm('bob', 'doe', 'bdoe', 'testtest', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('email', 'Invalid email address');
  });

  it('should display error message when email is not capgemini email', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@hotmail.com', 'abcd', 'abcd', 'Brest', 5);

    checkErrorMessage('email', 'Portal reserved to @capgemini.com collaborators');
  });

  it('should display error message when password not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com', '', '', 'Brest', 5);

    checkErrorMessage('newPassword', 'Must be at least 3 characters long');
  });

  it('should display error message when password not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcX', 'Brest', 5);

    checkErrorMessage('newPasswordConfirmation', 'Confirmation password is different from password');
  });

  it('should display error message when agency not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcX', '', 5);

    checkErrorMessage('agency', 'This field is mandatory');
  });

  it('should display error message when serviceLineId not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com', 'abcd', 'abcX', 'Brest', null);

    checkErrorMessage('serviceLineId', 'This field is mandatory');
  });

  function checkErrorMessage(formControlName: string, expectedMessage: string) {
    component.signinForm.controls[formControlName].markAsTouched();
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    expect(element.querySelector<HTMLElement>('mat-error').textContent).toBe(expectedMessage);
  }

  function updateForm(firstname, lastname, login, email, password, confirmationPassword, agency, serviceLineId) {
    component.signinForm.controls.firstname.setValue(firstname);
    component.signinForm.controls.lastname.setValue(lastname);
    component.signinForm.controls.login.setValue(login);
    component.signinForm.controls.email.setValue(email);
    component.signinForm.controls.agency.setValue(agency);
    component.signinForm.controls.serviceLineId.setValue(serviceLineId);
    component.signinForm.controls.newPassword.setValue(password);
    component.signinForm.controls.newPasswordConfirmation.setValue(confirmationPassword);
  }
});
