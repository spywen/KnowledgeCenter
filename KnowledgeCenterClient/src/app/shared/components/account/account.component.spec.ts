import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { TokenService } from 'src/app/shared/services/token.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Agency } from '../../models/Agency';
import { ServiceLine } from '../../models/ServiceLine';
import { TokenProfile } from '../../models/TokenProfile';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
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
    id: 1,
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
      imports: [
        SharedModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
            paramMap: of(convertToParamMap({id: null})),
            data: of({
              user: defaultUser,
              agencies,
              serviceLines
            })
          }
        },
        { provide: UserService, useValue: { update: () => of(defaultUser) }},
        { provide: TooltipService, useValue: { info: () => {} } },
        { provide: TokenService, useValue: {
            hasOneOfRoles: () => true, // ADMIN by default
            getTokenProfile: () => {
              return { id: 1 } as TokenProfile;
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display form with user data and save button should be enabled', () => {
    expect(component.accountForm.get('firstname').value).toBe(defaultUser.firstname);
    expect(component.accountForm.get('lastname').value).toBe(defaultUser.lastname);
    expect(component.accountForm.get('login').value).toBe(defaultUser.login);
    expect(component.accountForm.get('email').value).toBe(defaultUser.email);

    expect(component.accountForm.get('agency').value).toBe(defaultUser.agency);
    expect(component.accountForm.get('serviceLineId').value).toBe(defaultUser.serviceLine.id);

    expect(component.accountForm.get('oldPassword').value).toBe('');
    expect(component.accountForm.get('newPassword').value).toBe('');
    expect(component.accountForm.get('newPasswordConfirmation').value).toBe('');

    expect(component.accountForm.get('isActive').value).toBe(true);
    expect(component.accountForm.get('passwordTryCount').value).toBe(0);
    expect(element.querySelector<HTMLElement>('.adminZone').hidden).toBeFalsy();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeFalsy();
  });

  it('should initially display form without isActive and passwordTryCount when user is not admin', () => {
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.returnValue(false);
    fixture.detectChanges();

    expect(element.querySelector<HTMLInputElement>('input[name=firstname]')).not.toBeUndefined();
    expect(element.querySelector<HTMLElement>('.adminZone').hidden).toBeTruthy();
  });

  it('when account successfully updated should display success message', () => {
    const tooltipServiceSpy = spyOn(TestBed.get(TooltipService), 'info');

    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);
    fixture.detectChanges();
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeFalsy();
    component.update();

    expect(tooltipServiceSpy).toHaveBeenCalledWith(component.accountUpdatedTemplate);
  });

  it('should not display success message and redirect to list of users when admin is updating user account', () => {
    const tooltipServiceSpy = spyOn(TestBed.get(TooltipService), 'info');
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');
    spyOn(TestBed.get(TokenService), 'getTokenProfile').and.returnValue({id: 999});

    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);
    fixture.detectChanges();
    component.update();

    expect(tooltipServiceSpy).not.toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['administration/users']);
  });

  it('should display error message when firstname not provided', () => {
    updateForm('', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('firstname', 'This field is mandatory');
  });

  it('should display error message when lastname not provided', () => {
    updateForm('bob', '', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('lastname', 'This field is mandatory');
  });

  it('should display error message when login not provided', () => {
    updateForm('bob', 'doe', '', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('login', 'This field is mandatory');
  });

  it('should display error message when email not provided', () => {
    updateForm('bob', 'doe', 'bdoe', '',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('email', 'This field is mandatory');
  });

  it('should display error message when email  is not capgemini email', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@hotmail.com',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('email', 'Portal reserved to @capgemini.com collaborators');
  });

  it('should display error message when agency not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      null, serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('agency', 'This field is mandatory');
  });

  it('should display error message when serviceLineId not provided', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], null,
      '', '', '', true, 0);

    checkErrorMessage('serviceLineId', 'This field is mandatory');
  });

  it('should display error message when email is invalid', () => {
    updateForm('bob', 'doe', 'bdoe', 'invalidemail',
      agencies[0], serviceLines[0].id,
      '', '', '', true, 0);

    checkErrorMessage('email', 'Invalid email address');
  });

  it('should display error message when password not enough long', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      'a', 'a', 'a', true, 0);

    checkErrorMessage('newPassword', 'Must be at least 3 characters long');
  });

  it('should display error message when password is not the same than confirmation', () => {
    updateForm('bob', 'doe', 'bdoe', 'bob.doe@capgemini.com',
      agencies[0], serviceLines[0].id,
      'oldabcd', 'newabcd', 'newabcX', true, 0);

    checkErrorMessage('newPasswordConfirmation', 'Confirmation password is different from password');
  });

  function checkErrorMessage(formControlName: string, expectedMessage: string) {
    component.accountForm.controls[formControlName].markAsTouched();
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    expect(element.querySelector<HTMLElement>('mat-error').textContent).toBe(expectedMessage);
  }

  function updateForm(firstname, lastname, login, email, agency, serviceLineId,
                      oldPassword, password, confirmationPassword, isActive, passwordTryCount) {
    component.accountForm.controls.firstname.setValue(firstname);
    component.accountForm.controls.lastname.setValue(lastname);
    component.accountForm.controls.login.setValue(login);
    component.accountForm.controls.email.setValue(email);
    component.accountForm.controls.agency.setValue(agency);
    component.accountForm.controls.serviceLineId.setValue(serviceLineId);
    component.accountForm.controls.oldPassword.setValue(oldPassword);
    component.accountForm.controls.newPassword.setValue(password);
    component.accountForm.controls.newPasswordConfirmation.setValue(confirmationPassword);
    component.accountForm.controls.isActive.setValue(isActive);
    component.accountForm.controls.passwordTryCount.setValue(passwordTryCount);
  }
});
