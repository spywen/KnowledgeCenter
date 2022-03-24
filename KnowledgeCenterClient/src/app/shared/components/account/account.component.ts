import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/shared/models/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MustMatch, IsValidEmail } from 'src/app/shared/helpers/CustomValidators';
import { TokenService } from 'src/app/shared/services/token.service';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { Agency } from '../../models/Agency';
import { ServiceLine } from '../../models/ServiceLine';


export interface AgencyGroup {
  letter: string;
  agencies: Agency[];
}

export const filterAgency = (opt: Agency[], value: string): Agency[] => {
  if (value !== undefined) {
    const filterValue = value.toString().toLowerCase();
    return opt.filter(agency => agency.name.toString().toLowerCase().indexOf(filterValue) === 0);
  }
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {

  public accountForm: FormGroup;
  public agencyGroupOptions: Observable<AgencyGroup[]>;
  public agencyGroups: AgencyGroup[] = [];
  public serviceLines: ServiceLine[] = [];
  private currentAgency;

  @ViewChild('accountUpdated', { static: true })
  public accountUpdatedTemplate: TemplateRef<any>;

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              public tokenService: TokenService,
              private formBuilder: FormBuilder,
              private tooltipService: TooltipService) { }

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.initForm(data.user as User);
        this.initAgencies(data.agencies as Agency[]);
        this.initServiceLines(data.serviceLines as ServiceLine[]);
    });

    this.agencyGroupOptions = this.accountForm.get('agency').valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  formControls(formControlName: string) { return this.accountForm.controls[formControlName]; }

  initForm = (user: User) => {
    this.accountForm = this.formBuilder.group({
      id: [user.id, []],
      firstname: [user.firstname, [Validators.required]],
      lastname: [user.lastname, [Validators.required]],
      login: [user.login, [Validators.required, Validators.minLength(3)]],
      email: [user.email, [Validators.required, Validators.email]],
      agency: [user.agency, [Validators.required]],
      serviceLineId: [user.serviceLine ? user.serviceLine.id : 0, [Validators.required]],
      oldPassword: ['', Validators.minLength(3)],
      newPassword: ['', [Validators.minLength(3)]],
      newPasswordConfirmation: ['', []],
      isActive: [user.isActive, []],
      passwordTryCount: [user.passwordTryCount, []]
    }, {validators: [MustMatch('newPassword', 'newPasswordConfirmation'), IsValidEmail('email')] });

    this.currentAgency = user.agency;
  }

  update = () => {
    const request = {
      ...this.accountForm.getRawValue(),
      agencyId: this.accountForm.getRawValue().agency.id,
      agency: undefined
    };
    this.userService.update(request).subscribe(() => {
      // As admin, I edited account of someone else -> would like to go back to users list
      if (this.tokenService.getTokenProfile().id !== parseInt(this.accountForm.get('id').value, 10)) {
        this.router.navigate(['administration/users']);
      } else {
        this.tooltipService.info(this.accountUpdatedTemplate);
      }
    });
  }

  focusOutAgency(event) {
    if (!(event.relatedTarget != null && event.relatedTarget.classList.contains('onBlurAgencyMatOption'))) {
      const value = this.accountForm.get('agency').value;
      if (value.id === undefined) {
        this.accountForm.patchValue({agency: this.currentAgency});
      } else {
        this.currentAgency = value;
      }
    }
  }

  private initServiceLines = (serviceLines: ServiceLine[]) => {
    this.serviceLines = Array.from(serviceLines).sort((a, b) => this.alphabeticalSort(a, b));
  }

  private initAgencies = (agencies: Agency[]) => {
    Array.from(agencies).sort((a, b) => this.alphabeticalSort(a, b)).forEach(agency => {
      const agencyGroup = this.agencyGroups.find(x => x.letter === agency.name.substr(0, 1).toUpperCase());
      if (agencyGroup) {
        agencyGroup.agencies.push(agency);
      } else {
        this.agencyGroups.push({
          letter: agency.name.substr(0, 1).toUpperCase(),
          agencies: [agency]
        });
      }
    });
  }

  public displayAgencyName(agency?: Agency): string | undefined {
    return agency ? agency.name : undefined;
  }

  public filterGroup(value: string): AgencyGroup[] {
    if (value) {
      return this.agencyGroups
        .map(group => ({letter: group.letter, agencies: filterAgency(group.agencies, value)}))
        .filter(group => group.agencies.length > 0);
    }
    return this.agencyGroups;
  }

  private alphabeticalSort(a: Agency | ServiceLine, b: Agency | ServiceLine) {
    if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
    if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
    return 0;
  }
}
