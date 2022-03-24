import { Component, OnInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/shared/models/Role';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { User } from 'src/app/shared/models/User';
import { zip } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenService } from 'src/app/shared/services/token.service';
import { Tokens } from 'src/app/shared/models/Tokens';

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.less']
})
export class RolesDialogComponent implements OnInit {

  @ViewChild('roleUpdated', { static: true })
  public roleUpdatedTemplate: TemplateRef<any>;

  public roles: Role[];
  public rolesForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private formBuilder: FormBuilder,
    private tooltipService: TooltipService,
    private roleService: RoleService,
    private authService: AuthService,
    private tokenService: TokenService
    ) { }

  ngOnInit() {
    this.rolesForm = this.formBuilder.group({
      roles: this.formBuilder.array([])
    });

    const rolesRequest = this.roleService.getAllRoles();
    const userRolesRequest = this.roleService.getUserRoles(this.data.id);

    zip(rolesRequest, userRolesRequest).subscribe(result => {
      this.roles = result[0];
      const userRoles = result[1];

      this.rolesForm = this.formBuilder.group({
        roles: new FormArray(this.roles.map(role =>
          new FormControl(userRoles.findIndex(x => x.id === role.id) !== -1)))
      });
    });
  }

  public editRoles() {
    const roleSelectedIds = this.rolesForm.getRawValue().roles
      .map((isActive: boolean, i: number) => {
        if (isActive) {
          return this.roles[i].id;
        }
      })
      .filter((id: number) => id !== undefined);

    this.roleService.updateUserRoles(this.data.id, roleSelectedIds)
      .subscribe(() => {
        if (this.tokenService.getTokenProfile().id === this.data.id) {
          this.authService.refreshTokens(this.tokenService.getTokens()).subscribe((tokens: Tokens) => {
            this.tokenService.setTokens(tokens);
          });
        }
        this.tooltipService.info(this.roleUpdatedTemplate);
        this.dialogRef.close();
      });
  }
}
