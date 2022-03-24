import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agency } from '../../../shared/models/Agency';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { UserService } from '../../../shared/services/user.service';
import { Observable } from 'rxjs';
import { MustMatch, IsValidEmail } from 'src/app/shared/helpers/CustomValidators';
import { map, startWith } from 'rxjs/operators';

export interface AgencyGroup {
  letter: string;
  agencies: Agency[];
}

export const filterAgency = (opt: Agency[], value: string): Agency[] => {
  const filterValue = value.toString().toLowerCase();
  return opt.filter(agency => agency.name.toString().toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.less']
})
export class SigninComponent implements OnInit {

  public signinForm: FormGroup;
  public agencyGroupOptions: Observable<AgencyGroup[]>;
  public agencyGroups: AgencyGroup[] = [];
  public serviceLines: ServiceLine[] = [];
  private currentAgency;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      login: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      newPasswordConfirmation: ['', [Validators.required]],
      agency: ['', [Validators.required]],
      serviceLineId: ['', [Validators.required]]
    }, {validators: [MustMatch('newPassword', 'newPasswordConfirmation'), IsValidEmail('email')]});

    this.route.data
      .subscribe(data => {
        this.initAgencies(data.agencies as Agency[]);
        this.initServiceLines(data.serviceLines as ServiceLine[]);
      });

    this.agencyGroupOptions = this.signinForm.get('agency').valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  formControls(formControlName: string) { return this.signinForm.controls[formControlName]; }

  signin() {
    const request = {
      ...this.signinForm.getRawValue(),
      agencyId: this.signinForm.getRawValue().agency.id,
      agency: undefined
    };
    this.userService.signIn(request).subscribe(() => {
      this.router.navigate(['login'], { queryParams: { justSignedIn: true } });
    });
  }

  focusOutAgency(event) {
    if (!(event.relatedTarget != null && event.relatedTarget.classList.contains('onBlurAgencyMatOption'))) {
      const value = this.signinForm.get('agency').value;
      if (value.id === undefined) {
        this.signinForm.patchValue({agency: this.currentAgency});
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
