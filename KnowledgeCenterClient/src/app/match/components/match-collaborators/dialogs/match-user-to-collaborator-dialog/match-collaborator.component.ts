import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agency } from '../../../../../shared/models/Agency';
import { Observable } from 'rxjs';
import { ServiceLine } from '../../../../../shared/models/ServiceLine';
import { map, startWith } from 'rxjs/operators';
import { IsNumeric, IsValidEmail } from '../../../../../shared/helpers/CustomValidators';
import { CollaboratorsService } from '../../../../services/collaborators.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collaborator } from 'src/app/match/models/Collaborator';
import { Router } from '@angular/router';

export interface CollaboratorCreationOrEditionParameters {
  sites: Agency[];
  serviceLines: ServiceLine[];
  collaborator: Collaborator;
}

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
  selector: 'app-match-collaborator',
  templateUrl: './match-collaborator.component.html',
  styleUrls: ['./match-collaborator.component.less']
})
export class MatchCollaboratorComponent implements OnInit {

  public createCollaboratorForm: FormGroup;
  public agencyGroupOptions: Observable<AgencyGroup[]>;
  private agencyGroups: AgencyGroup[] = [];
  public serviceLines: ServiceLine[] = [];
  private currentAgency;
  public collaborator: Collaborator;

  constructor(private formBuilder: FormBuilder,
              private collaboratorsService: CollaboratorsService,
              private dialogRef: MatDialogRef<MatchCollaboratorComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: CollaboratorCreationOrEditionParameters) { }


  ngOnInit(): void {
    this.createCollaboratorForm = this.formBuilder.group({
      id: [this.data.collaborator ? this.data.collaborator.id : ''],
      firstname: [ this.data.collaborator ? this.data.collaborator.firstname : '', [Validators.required]],
      lastname: [this.data.collaborator ? this.data.collaborator.lastname  : '', [Validators.required]],
      email: [this.data.collaborator ?  this.data.collaborator.email  : '', [Validators.required, Validators.email]],
      ggid: [this.data.collaborator ? this.data.collaborator.ggid : '',
       [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      agency: [this.data.collaborator ? this.data.collaborator.agency  : '', [Validators.required]],
      serviceLineId: [this.data.collaborator && this.data.collaborator.serviceLine ? this.data.collaborator.serviceLine.id  : '', ],
    }, {validator: [IsValidEmail('email'), IsNumeric('ggid')] });

    this.initAgencies(this.data.sites);
    this.initServiceLines(this.data.serviceLines);
    this.agencyGroupOptions = this.createCollaboratorForm.get('agency').valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
      );
  }

  formControls(formControlName: string): AbstractControl {
    return this.createCollaboratorForm.controls[formControlName];
  }

  public create(): void {
    const request = {
      ...this.createCollaboratorForm.getRawValue(),
      agencyId: this.createCollaboratorForm.getRawValue().agency.id
    };
    this.collaboratorsService.create(request).subscribe((collaborator: Collaborator) => {
      this.dialogRef.close(collaborator);
      this.router.navigate(['match/collaborators'], { queryParams: { ggid: collaborator.ggid } });
    });
  }

  public edit(): void {
    const request = {
      ...this.createCollaboratorForm.getRawValue(),
      agencyId: this.createCollaboratorForm.getRawValue().agency.id,
      agency: undefined
    };
    this.collaboratorsService.edit(request).subscribe((editedCollaborator: Collaborator) => {
      this.dialogRef.close(editedCollaborator);
    });
  }

  public focusOutAgency(event): void {
    if (!(event.relatedTarget != null && event.relatedTarget.classList.contains('onBlurAgencyMatOption'))) {
      const value = this.createCollaboratorForm.get('agency').value;
      if (value.id === undefined) {
        this.createCollaboratorForm.patchValue({agency: this.currentAgency});
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

  private filterGroup(value: string): AgencyGroup[] {
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
