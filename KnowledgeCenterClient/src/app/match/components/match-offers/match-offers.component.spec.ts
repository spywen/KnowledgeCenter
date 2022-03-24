import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOffersComponent } from './match-offers.component';
import { CustomerOffer } from '../../models/CustomerOffer';
import { SkillLevel } from '../../models/SkillLevel';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OfferService } from '../../services/offer.service';
import { CustomerOfferStatus } from '../../models/CustomerOfferStatus';
import { User } from '../../../shared/models/User';
import { CustomerSite } from '../../models/CustomerSite';
import { CustomerOfferSkill } from '../../models/CustomerOfferSkill';
import { BasePaginationResponse } from '../../../shared/models/BasePagination';
import { Customer } from '../../models/Customer';
import { Agency } from '../../../shared/models/Agency';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { Skill } from '../../models/Skill';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MatchOffersComponent', () => {
  let component: MatchOffersComponent;
  let fixture: ComponentFixture<MatchOffersComponent>;
  let agencies: Agency[];
  let serviceLines: ServiceLine[];
  let userBobDoe: User;
  let customerSites: CustomerSite[];
  let customerOfferAmadeus: CustomerOffer;
  let customerOffers: BasePaginationResponse<CustomerOffer[]>;
  let customerOfferResolverResults: any[];

  beforeEach(async(() => {
    initializeTestData();

    TestBed.configureTestingModule({
      declarations: [ MatchOffersComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {data: of({customerOfferResolverResults})}},
        {
          provide: OfferService, useValue: {
            get: () => { of({}); }
          }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchOffersComponent);
    component = fixture.componentInstance;
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
      } as CustomerSite,
      {
        id: 2,
        name: 'Sophia Antipolis',
        address: 'Address for Sophia',
        contact: null,
        customer: customerAmadeus,
        customerId: customerAmadeus.id
      } as CustomerSite
    ] as CustomerSite[];

    serviceLines = [ {
      id: 5,
      name: 'DIT',
      description: 'Digital Innovation And Transformation'
    } ] as ServiceLine[];

    agencies = [ {
      id: 26,
      name: 'Brest',
      postalCode: '29200'
    } ] as Agency[];

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
