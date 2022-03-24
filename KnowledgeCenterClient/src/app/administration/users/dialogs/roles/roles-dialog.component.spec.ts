import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesDialogComponent } from './roles-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoleService } from 'src/app/shared/services/role.service';
import { of } from 'rxjs';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { User } from 'src/app/shared/models/User';
import { Role } from 'src/app/shared/models/Role';
import { TokenService } from 'src/app/shared/services/token.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenProfile } from 'src/app/shared/models/TokenProfile';
import { Tokens } from 'src/app/shared/models/Tokens';

describe('RolesComponent', () => {
  let component: RolesDialogComponent;
  let fixture: ComponentFixture<RolesDialogComponent>;
  let element: HTMLElement;

  const roles = [
    { id: 1, description: 'Admin'},
    { id: 2, description: 'User'},
  ] as Role[];
  const user = { id: 1, fullname: 'John Doe' } as User;
  const userRoles = [roles[1]] as Role[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      declarations: [ RolesDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: user },
        { provide: RoleService, useValue: {
            updateUserRoles: () => of(),
            getAllRoles: () => of(roles),
            getUserRoles: () => of(userRoles)
          }
        },
        { provide: TooltipService, useValue: { info: () => {} } },
        { provide: AuthService, useValue: { refreshTokens: () => of({}) } },
        { provide: TokenService, useValue: {
          getTokenProfile: () => ({ id: 2 } as TokenProfile),
          getTokens: () => {},
          setTokens: () => {}
         } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all roles when popup is opened', () => {
    expect(element.querySelectorAll('.mat-checkbox').length).toBe(2);
    expect(element.querySelectorAll('.mat-checkbox')[0].textContent.trim()).toBe('Admin');
    expect(element.querySelectorAll('.mat-checkbox')[1].textContent.trim()).toBe('User');
  });

  it('should display user\'s roles as checked when popup is opened', () => {
    expect(element.querySelectorAll('.mat-checkbox')[0].querySelector('input').checked).toBeFalsy();
    expect(element.querySelectorAll('.mat-checkbox')[1].querySelector('input').checked).toBeTruthy();
  });

  it('when update user roles with a new role should update them, raise tooltip and close popup', () => {
    const updateUserRolesSpyOn = spyOn(TestBed.get(RoleService), 'updateUserRoles').and.returnValue(of({}));
    const tooltipServiceSpyOn = spyOn(TestBed.get(TooltipService), 'info');
    const dialogCloseSpyOn = spyOn(TestBed.get(MatDialogRef), 'close');

    element.querySelectorAll('.mat-checkbox')[0].querySelector('input').click();
    element.querySelector<HTMLButtonElement>('button[type="submit"]').click();

    expect(updateUserRolesSpyOn).toHaveBeenCalledWith(user.id, [1, 2]);
    expect(tooltipServiceSpyOn).toHaveBeenCalledWith(component.roleUpdatedTemplate);
    expect(dialogCloseSpyOn).toHaveBeenCalled();
  });

  it('when update current user roles with a new role should also refresh his tokens', () => {
    spyOn(TestBed.get(TokenService), 'getTokenProfile').and.returnValue({ id: 1 } as TokenProfile);
    const tokens = { token: 'TOKEN', refreshToken: 'REFRESHTOKEN' } as Tokens;
    const updateUserRolesSpyOn = spyOn(TestBed.get(RoleService), 'updateUserRoles').and.returnValue(of({}));
    const tooltipServiceSpyOn = spyOn(TestBed.get(TooltipService), 'info');
    const dialogCloseSpyOn = spyOn(TestBed.get(MatDialogRef), 'close');
    const refreshTokensSpyOn = spyOn(TestBed.get(AuthService), 'refreshTokens').and.returnValue(of(tokens));
    const setTokensSpyOn = spyOn(TestBed.get(TokenService), 'setTokens');

    element.querySelectorAll('.mat-checkbox')[0].querySelector('input').click();
    element.querySelector<HTMLButtonElement>('button[type="submit"]').click();

    expect(updateUserRolesSpyOn).toHaveBeenCalledWith(user.id, [1, 2]);

    expect(refreshTokensSpyOn).toHaveBeenCalled();
    expect(setTokensSpyOn).toHaveBeenCalledWith(tokens);

    expect(tooltipServiceSpyOn).toHaveBeenCalledWith(component.roleUpdatedTemplate);
    expect(dialogCloseSpyOn).toHaveBeenCalled();
  });
});
