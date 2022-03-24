import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchOffersSideListComponent } from './match-offers-side-list.component';
import { Agency } from '../../../../shared/models/Agency';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { User } from '../../../../shared/models/User';
import { CustomerSite } from '../../../models/CustomerSite';
import { CustomerOffer } from '../../../models/CustomerOffer';
import { BasePaginationResponse } from '../../../../shared/models/BasePagination';
import { SharedModule } from '../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OfferService } from '../../../services/offer.service';
import { Customer } from '../../../models/Customer';
import { CustomerOfferStatus } from '../../../models/CustomerOfferStatus';
import { Skill } from '../../../models/Skill';
import { SkillLevel } from '../../../models/SkillLevel';
import { CustomerOfferSkill } from '../../../models/CustomerOfferSkill';

describe('MatchOffersSideListComponent', () => {
  let component: MatchOffersSideListComponent;
  let fixture: ComponentFixture<MatchOffersSideListComponent>;
  let element: HTMLElement;
  let agencies: Agency[];
  let serviceLines: ServiceLine[];
  let userBobDoe: User;
  let customerSites: CustomerSite[];
  let customerOfferAmadeus: CustomerOffer;
  let customerOffers: BasePaginationResponse<CustomerOffer[]>;
  let customerOfferResolverResults: any[];

  beforeEach((() => {
    initializeTestData();

    TestBed.configureTestingModule({
      declarations: [ MatchOffersSideListComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {data: of({customerOfferResolverResults})}},
        {provide: OfferService, useValue: {getAll: () => of({})}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchOffersSideListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function initializeTestData() {
    const customerAmadeus = {
      id: 1,
      name: 'Amadeus'
    } as Customer;

    customerSites = [
      {
        id: 1,
        name: 'Paris',
        address: 'Address for Paris',
        contact: 'Contact tel or email',
        customer: customerAmadeus,
        customerId: customerAmadeus.id
      },
      {
        id: 2,
        name: 'Sophia Antipolis',
        address: 'Address for Sophia',
        contact: null,
        customer: customerAmadeus,
        customerId: customerAmadeus.id
      }
    ] as CustomerSite[];

    agencies = [ {
      id: 26,
      name: 'Brest',
      postalCode: '29200'
    } ] as Agency[];

    serviceLines = [ {
      id: 5,
      name: 'DIT',
      description: 'Digital Innovation And Transformation'
    } ] as ServiceLine[];

    userBobDoe = {
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

    customerOfferAmadeus = {
      id: 1,
      jobTitle: 'Angular Developer',
      requester: 'Bob Doe',
      creationDate: new Date(),
      missionStartDate: new Date(2019, 5, 1),
      missionEndDate: new Date(2019, 3, 1),
      mobilityRequired: true,
      onSite: true,
      workFromHome: false,
      customerOfferStatus: {
        id: 1,
        code: 'OPEN',
        description: 'OPEN'
      } as CustomerOfferStatus,
      description: 'Angular Developer',
      customerAccountManager: userBobDoe,
      customerSite: customerSites[0],
      customerOfferSkills: [
        {
          id: 1,
          skillId: 1,
          skill: {
            id: 1,
            name: 'Angular',
            serviceLineId: 5,
            serviceLine: serviceLines[0]
          } as Skill,
          skillLevelId: 1,
          skillLevel: {
            id: 1,
            name: 'Expert',
            order: 1
          } as SkillLevel,
          skillPriority: 1,
          creationDate: new Date(),
          modificationDate: new Date()
        } as CustomerOfferSkill
      ] as CustomerOfferSkill[]
    } as CustomerOffer;

    customerOffers = {
      data: [ customerOfferAmadeus ],
      size: 1,
      page: 1,
      totalItems: 1,
      totalPages: 1
    } as BasePaginationResponse<CustomerOffer[]>;
    customerOfferResolverResults = [ customerOffers, [], [], [], [] ];
  }
});
