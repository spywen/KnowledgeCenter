import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from '../../../../shared/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { Collaborator } from '../../../models/Collaborator';
import { Agency } from '../../../../shared/models/Agency';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { CollaboratorFilter } from '../../../models/CollaboratorFilter';
import { BasePaginationResponse, BasePaginationRequest } from 'src/app/shared/models/BasePagination';
import { MatDialog } from '@angular/material';
import {
  MatchCollaboratorComponent, CollaboratorCreationOrEditionParameters
 } from '../dialogs/match-user-to-collaborator-dialog/match-collaborator.component';
import { CollaboratorsService, DEFAULT_COLLABORATOR_PER_PAGE } from 'src/app/match/services/collaborators.service';

export interface AppliedFilter {
  name: string;
  displayedName: string;
  controlName: string;
}

@Component({
  selector: 'app-match-collaborators-side-list',
  templateUrl: './match-collaborators-side-list.component.html',
  styleUrls: ['./match-collaborators-side-list.component.less'],
  animations: [
    trigger('revealAdditionalFiltersAnimation', [
      state('closed', style({height: '0', opacity: '0'})),
      state('opened', style({opacity: '1'})),
      transition('opened => closed', animate('300ms ease-out')),
      transition('closed => opened', animate('300ms ease-out')),
    ])
  ]
})

export class MatchCollaboratorsSideListComponent implements OnInit {

  @Input() collaboratorDeleteEvent: Observable<Collaborator> = new Observable<Collaborator>();
  @Output() selectedCollaborator = new EventEmitter();
  @Input() sites: Agency[];
  @Input() serviceLines: ServiceLine[];
  @Input() collaboratorEditEvent: Observable<Collaborator> = new Observable<Collaborator>();

  private readonly debounceTime = 200;
  private currentPage = 1;
  private lastPageNumber = 1;
  private searchFieldTextChanged: Subject<string> = new Subject();
  private collaboratorFilter: CollaboratorFilter = { keyword: '', roleId: 0, roleCode: '', agencyId: 0, serviceLineId: 0 };
  public collaborators: BasePaginationResponse<Collaborator[]>;
  public additionalFiltersAnimationState = 'closed';
  public appliedFilters: AppliedFilter[] = [];
  public filtersForm: FormGroup;
  public activeCollaboratorIndex: number;
  public filteredCollaborators: Collaborator[];
  public isOpened = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public tokenService: TokenService,
    public dialog: MatDialog,
    private collaboratorService: CollaboratorsService
  ) { }

  ngOnInit() {

   this.route.data.subscribe(data => {
      this.filteredCollaborators = data.collaboratorResolverResults[0].data;
      this.lastPageNumber = (data.collaboratorResolverResults[0] as BasePaginationResponse<Collaborator[]>).totalPages;
      this.sites = data.collaboratorResolverResults[1];
      this.serviceLines = data.collaboratorResolverResults[2];
    });

   this.searchFieldTextChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(searchFieldValue => {
          this.collaboratorFilter.keyword = searchFieldValue;
          this.getCollaborators();
      });

   this.filtersForm = this.formBuilder.group({
      searchField: [''],
      site: [''],
      serviceLine: ['']
    });

   this.route.queryParams
    .pipe(filter(params => params.ggid))
    .subscribe(params => {
      if (params.ggid) {
        this.collaboratorFilter.keyword = params.ggid;
        this.getCollaborators();
      }
    });

   this.collaboratorDeleteEvent.subscribe(collaborator => this.deleteCollaboratorProfile(collaborator));
   this.collaboratorEditEvent.subscribe(collaborator => this.editCollaborator(collaborator));
  }

  public onApplyNewFilter(event: any) {
    switch (event.source._id) {
      case 'site':
        this.collaboratorFilter.agencyId = event.value.id;
        break;
      case 'serviceLine':
        this.collaboratorFilter.serviceLineId = event.value.id;
        break;
    }

    this.appliedFilters.push({
      name: event.value.name,
      displayedName: event.source._placeholder + ': ' + event.value.name,
      controlName: event.source._id} as AppliedFilter);
    this.getCollaborators();
  }

  public removeFilter(removedFilter: AppliedFilter) {
    switch (removedFilter.controlName) {
      case 'site':
        this.collaboratorFilter.agencyId = 0;
        break;
      case 'serviceLine':
        this.collaboratorFilter.serviceLineId = 0;
        break;
    }
    const index = this.appliedFilters.indexOf(removedFilter);
    this.appliedFilters.splice(index, 1);
    this.filtersForm.get(removedFilter.controlName).setValue('');
    this.getCollaborators();
  }

  public switchAdditionalFiltersVisibility() {
    this.additionalFiltersAnimationState = (this.additionalFiltersAnimationState === 'closed' ? 'opened' : 'closed');
    this.isOpened = this.additionalFiltersAnimationState === 'opened';
  }

  public onSearchFieldValueChanged(event: any) {
    this.searchFieldTextChanged.next(event.target.value.trim().toLowerCase());
  }

  public onClickCollaborator(collaborator: Collaborator, collaboratorIndex: number) {
    this.selectedCollaborator.emit(collaborator);
    this.activeCollaboratorIndex = collaboratorIndex;
  }

  public onScrollDown() {
    if (this.currentPage + 1 > this.lastPageNumber) {
      return;
    }
    this.currentPage++;
    this.getCollaborators(false);
  }

  public deleteCollaboratorProfile(collaborator: Collaborator) {
    delete this.filteredCollaborators.find(x => x.id === collaborator.id).ggid;
  }

  public editCollaborator(collaborator: Collaborator) {
   const collabIndex: number = this.filteredCollaborators.findIndex(x => x.id === collaborator.id);
   this.filteredCollaborators[collabIndex] = collaborator;
  }

  private getCollaborators(shouldResetPagination: boolean = true) {
    if (shouldResetPagination) {
      this.currentPage = 1;
    }

    this.collaboratorService.getAll({
        filters: this.collaboratorFilter,
        page: this.currentPage,
        size: DEFAULT_COLLABORATOR_PER_PAGE
      } as BasePaginationRequest<CollaboratorFilter>)
      .subscribe((response: BasePaginationResponse<Collaborator[]>) => {
        this.lastPageNumber = response.totalPages;

        if (shouldResetPagination) {
          this.filteredCollaborators = response.data;
        } else {
          response.data.forEach(user => {
            this.filteredCollaborators.push(user);
          });
        }
      });
  }

  public onCreate(): void {
    const dialogRef = this.dialog.open(MatchCollaboratorComponent, {
      width: '400px',
      data: {
        serviceLines: this.serviceLines,
        sites: this.sites
      } as CollaboratorCreationOrEditionParameters
    });
    dialogRef.afterClosed().subscribe((newCollaborator: Collaborator) => {
      if (newCollaborator) {
        this.filtersForm.reset();
        this.getCollaborators(true);
        this.filtersForm.patchValue({searchField:  this.collaboratorFilter.keyword});
      }
    });
  }
}
