import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CustomerOffer } from '../../../models/CustomerOffer';
import { Agency } from '../../../../shared/models/Agency';
import { debounceTime } from 'rxjs/operators';
import { CustomerSite } from '../../../models/CustomerSite';
import { User } from '../../../../shared/models/User';
import { CustomerOfferStatus } from '../../../models/CustomerOfferStatus';
import { CustomerOfferFilter } from '../../../models/CustomerOfferFilter';
import { BasePaginationRequest, BasePaginationResponse } from '../../../../shared/models/BasePagination';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from '../../../../shared/services/token.service';
import { DEFAULT_OFFER_PER_PAGE, OfferService } from '../../../services/offer.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Customer } from '../../../models/Customer';
import { MatchOffersChangesDetectedDialogComponent } from '../dialogs/match-offers-changes-detected-dialog/match-offers-changes-detected-dialog.component';

export interface AppliedFilter {
  displayedName: string;
  controlName: string;
}

@Component({
  selector: 'app-match-offers-side-list',
  templateUrl: './match-offers-side-list.component.html',
  styleUrls: [ './match-offers-side-list.component.less' ],
  animations: [
    trigger('revealAdditionalFiltersAnimation', [
      state('closed', style({height: '0', opacity: '0'})),
      state('opened', style({opacity: '1'})),
      transition('opened => closed', animate('300ms ease-out')),
      transition('closed => opened', animate('300ms ease-out')),
    ])
  ],
  providers: [ DatePipe ]
})
export class MatchOffersSideListComponent implements OnInit {

  @Input() customerOfferDeleteEvent: Observable<CustomerOffer> = new Observable<CustomerOffer>();
  @Output() selectedOffer = new EventEmitter();
  @Output() newCustomerOffer = new EventEmitter();
  @Input() sites: Agency[];
  @Input() customerSites: CustomerSite[];
  @Input() customerOfferEditEvent: Observable<CustomerOffer> = new Observable<CustomerOffer>();
  @Input() customerOfferAddEvent: Observable<CustomerOffer> = new Observable<CustomerOffer>();
  @Input() customerOfferStatus: CustomerOfferStatus[];
  @Input() customerOfferInfoModificationEvent: Observable<boolean> = new Observable<boolean>();
  @Input() customerOfferRequiredSkillsModificationEvent: Observable<boolean> = new Observable<boolean>();

  private readonly debounceTime = 200;
  private customerOfferInfoModifications = false;
  private customerOfferRequiredSkillModifications = false;
  private currentPage = 1;
  private lastPageNumber = 1;
  private customerOfferFilter: CustomerOfferFilter = {
    keyword: '',
    customerId: 0,
    agencyId: 0,
    customerAccountManagerId: 0,
    customerOfferStatusId: 0,
    jobTitle: '',
    creationDateStart: null,
    creationDateEnd: null
  };
  public customers: Customer[];
  public customerAccountManagers: User[];
  private searchFieldTextChanged: Subject<string> = new Subject();
  public aditionalFiltersAnimationState = 'closed';
  public appliedFilters: AppliedFilter[] = [];
  public filtersForm: FormGroup;
  public activeOfferIndex: number;
  public filteredCustomerOffers: CustomerOffer[];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public tokenService: TokenService,
    public dialog: MatDialog,
    public offersService: OfferService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.filteredCustomerOffers = data.customerOfferResolverResults[0].data;
      this.lastPageNumber = (data.customerOfferResolverResults[0] as BasePaginationResponse<CustomerOffer[]>).totalPages;
      this.sites = data.customerOfferResolverResults[1];
      this.customerOfferStatus = data.customerOfferResolverResults[5];
      this.customers = this.filteredCustomerOffers
        .map(x => x.customerSite.customer)
        .reduce((uniques, currentCustomer) => {
          if (!uniques.find(customer => customer.id === currentCustomer.id)) { uniques.push(currentCustomer); }
          return uniques;
        }, []);
      this.customerAccountManagers = this.filteredCustomerOffers
        .map(x => x.customerAccountManager)
        .reduce((uniques, currentCustomerAccountManager) => {
          if (!uniques.find(customerAccountManager => customerAccountManager.id === currentCustomerAccountManager.id)) { uniques.push(currentCustomerAccountManager); }
          return uniques;
        }, []);
    });

    this.searchFieldTextChanged
      .pipe(debounceTime(this.debounceTime))
      .subscribe(searchFieldValue => {
        this.customerOfferFilter.keyword = searchFieldValue;
        this.getOffers();
      });

    this.filtersForm = this.formBuilder.group({
      searchField: [ '' ],
      customer: [ '' ],
      creationDateStart: { disabled: true, value: ''},
      creationDateEnd: { disabled: true, value: ''},
      customerAccountManager: [ '' ],
      customerAccountManagerSite: [ '' ],
      status: [ '' ]
    });

    this.customerOfferDeleteEvent.subscribe(customerOffer => this.deleteCustomerOffer(customerOffer));
    this.customerOfferEditEvent.subscribe(customerOffer => this.editCustomerOffer(customerOffer));
    this.customerOfferAddEvent.subscribe(customerOffer => this.addCustomerOffer(customerOffer));
    this.customerOfferInfoModificationEvent.subscribe(areThereCustomerOfferInfoModifications => this.customerOfferInfoModifications = areThereCustomerOfferInfoModifications);
    this.customerOfferRequiredSkillsModificationEvent
      .subscribe(areThereRequiredSkillsModifications => this.customerOfferRequiredSkillModifications = areThereRequiredSkillsModifications);
  }

  public deleteCustomerOffer(customerOffer: CustomerOffer) {
    const customerOfferIndex: number = this.filteredCustomerOffers.findIndex(x => x.id === customerOffer.id);
    this.filteredCustomerOffers.splice(customerOfferIndex, 1);
    this.activeOfferIndex = undefined;
  }

  public editCustomerOffer(customerOffer: CustomerOffer) {
    const customerOfferIndex: number = this.filteredCustomerOffers.findIndex(x => x.id === customerOffer.id);
    this.filteredCustomerOffers[customerOfferIndex] = customerOffer;
  }

  public addCustomerOffer(customerOffer: CustomerOffer) {
    this.filteredCustomerOffers.unshift(customerOffer);
  }

  public onApplyNewFilter(event: any) {
    let displayedValue = event.value.name;
    if (event.source != null) {
      switch (event.source._id) {
        case 'customer':
          this.customerOfferFilter.customerId = event.value.id;
          break;
        case 'customerAccountManager':
          this.customerOfferFilter.customerAccountManagerId = event.value.id;
          displayedValue = event.value.fullname;
          break;
        case 'customerAccountManagerSite':
          this.customerOfferFilter.agencyId = event.value.id;
          break;
        case 'status':
          this.customerOfferFilter.customerOfferStatusId = event.value.id;
          displayedValue = event.value.description;
          break;
      }
      this.appliedFilters.push({
        name: event.value.name,
        displayedName: event.source._placeholder + ': ' + displayedValue,
        controlName: event.source._id
      } as AppliedFilter);
      this.getOffers();
    } else {
      switch (event.targetElement.id) {
        case 'creationDateStart':
          this.customerOfferFilter.creationDateStart = new Date(event.value);
          break;
        case 'creationDateEnd':
          this.customerOfferFilter.creationDateEnd = new Date(event.value);
          break;
      }
      this.appliedFilters.push({
        name: event,
        displayedName: event.targetElement.placeholder + ': ' + this.datePipe.transform(new Date(event.value), 'dd/MM/yyyy'),
        controlName: event.targetElement.id
      } as AppliedFilter);
      this.getOffers();
    }
  }

  public removeFilter(removedFilter: AppliedFilter) {
    switch (removedFilter.controlName) {
      case 'customer':
        this.customerOfferFilter.customerId = 0;
        break;
      case 'creationDateStart':
        this.customerOfferFilter.creationDateStart = null;
        break;
      case 'creationDateEnd':
        this.customerOfferFilter.creationDateEnd = null;
        break;
      case 'customerAccountManager':
        this.customerOfferFilter.customerAccountManagerId = 0;
        break;
      case 'customerAccountManagerSite':
        this.customerOfferFilter.agencyId = 0;
        break;
      case 'status':
        this.customerOfferFilter.customerOfferStatusId = 0;
        break;
    }
    const index = this.appliedFilters.indexOf(removedFilter);
    this.appliedFilters.splice(index, 1);
    this.filtersForm.get(removedFilter.controlName).setValue('');
    this.getOffers();
  }

  public onSearchFieldValueChanged(event: any) {
    this.searchFieldTextChanged.next(event.target.value.trim().toLowerCase());
  }

  public switchAdditionalFiltersVisibility() {
    this.aditionalFiltersAnimationState = (this.aditionalFiltersAnimationState === 'closed' ? 'opened' : 'closed');
  }

  public onScrollDown() {
    if (this.currentPage + 1 > this.lastPageNumber) {
      return;
    }
    this.currentPage++;
    this.getOffers(false);
  }

  public onClickAddCustomerOffer() {
    if (this.customerOfferInfoModifications || this.customerOfferRequiredSkillModifications) {
      const dialogChangesDetectedRef = this.dialog.open(MatchOffersChangesDetectedDialogComponent, { width: '500px' });
      dialogChangesDetectedRef.afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.newCustomerOffer.emit(true);
          this.activeOfferIndex = undefined;
        }
      });
    } else {
      this.newCustomerOffer.emit(true);
      this.activeOfferIndex = undefined;
    }
  }

  public onClickCustomerOffer(offer: CustomerOffer, offerIndex: number) {
    if (this.customerOfferInfoModifications || this.customerOfferRequiredSkillModifications) {
      const dialogChangesDetectedRef = this.dialog.open(MatchOffersChangesDetectedDialogComponent, { width: '500px' });
      dialogChangesDetectedRef.afterClosed().subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.selectedOffer.emit(offer);
          this.activeOfferIndex = offerIndex;
        }
      });
    } else {
      this.selectedOffer.emit(offer);
      this.activeOfferIndex = offerIndex;
    }
  }

  private getOffers(shouldResetPagination: boolean = true) {
    if (shouldResetPagination) {
      this.currentPage = 1;
    }

    this.offersService.getAll({
        filters: this.customerOfferFilter,
        page: this.currentPage,
        size: DEFAULT_OFFER_PER_PAGE
      } as BasePaginationRequest<CustomerOfferFilter>)
      .subscribe((response: BasePaginationResponse<CustomerOffer[]>) => {
        this.lastPageNumber = response.totalPages;

        if (shouldResetPagination) {
          this.filteredCustomerOffers = response.data;
        } else {
          response.data.forEach(offer => {
            this.filteredCustomerOffers.push(offer);
          });
        }
      });
  }
}
