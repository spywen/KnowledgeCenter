import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatchCollaboratorsSideListComponent } from './match-collaborators-side-list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Collaborator } from '../../../models/Collaborator';
import { Agency } from '../../../../shared/models/Agency';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { CollaboratorSkill } from '../../../models/CollaboratorSkill';
import { Skill } from '../../../models/Skill';
import { SkillLevel } from '../../../models/SkillLevel';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BasePaginationResponse, BasePaginationRequest } from '../../../../shared/models/BasePagination';
import { TokenService } from '../../../../shared/services/token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CollaboratorsService, DEFAULT_COLLABORATOR_PER_PAGE } from 'src/app/match/services/collaborators.service';
import { CollaboratorFilter } from 'src/app/match/models/CollaboratorFilter';
import { MatDialog } from '@angular/material';
import { MatchCollaboratorComponent } from '../dialogs/match-user-to-collaborator-dialog/match-collaborator.component';

describe('MatchCollaboratorsSideListComponent', () => {
  let component: MatchCollaboratorsSideListComponent;
  let fixture: ComponentFixture<MatchCollaboratorsSideListComponent>;
  let element: HTMLElement;
  let serviceLines: ServiceLine[];
  let sites: Agency[];
  let skillLevelNovice: SkillLevel;
  let skillLevelExpert: SkillLevel;
  let skillReact: Skill;
  let skillAgile: Skill;
  let skillEnglish: Skill;
  let bobCollaborator: Collaborator;
  let camilleCollaborator: Collaborator;
  let collaborators: BasePaginationResponse<Collaborator[]>;
  let collaboratorResolverResults: any[];

  const mockUserRole = (userRoles: string[]) => {
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.callFake((requiredRoles: string[]) => {
      let isAllowed = false;
      requiredRoles.forEach(requiredRole => {
        if (userRoles.includes(requiredRole)) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
  };

  beforeEach((() => {

    initData();
    TestBed.configureTestingModule({
      declarations: [ MatchCollaboratorsSideListComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
          { provide: ActivatedRoute, useValue: {
                data: of({collaboratorResolverResults}),
                queryParams: of({})
            }
          },
        { provide: TokenService, useValue: {
            hasOneOfRoles: () => true, // ADMIN
            getGravatarPerEmail: () => ''
          }
        },
        { provide: CollaboratorsService, useValue: { getAll: () => of(collaborators) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCollaboratorsSideListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the add collaborator dialog when the plus icon is clicked', () => {
    const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
    const dialogRefMock = { afterClosed: () => of(false)};
    const serviceLinesList = serviceLines.reverse();
    openDialogSpy.and.returnValue(dialogRefMock);
    element.querySelector<HTMLButtonElement>('.bottom-right-absolute-button').click();

    expect(openDialogSpy).toHaveBeenCalledWith(MatchCollaboratorComponent, {
      width: '400px',
      data : {
        serviceLines: serviceLinesList,
        sites
      }
    });
  });

  it('list should initialy contain two collaborators, the searchfield should be empty and no filter should be applied', () => {
    expect(component.sites.length).toBe(2);
    expect(component.serviceLines.length).toBe(2);
    expect(component.filteredCollaborators.length).toBe(2);
    expect(fixture.debugElement.query(By.css('input[name=search]')).nativeElement.value).toBe('');
    expect(component.appliedFilters.length).toBe(0);
  });

  it('should get filtered collaborators when user is entering a keyword as filter', fakeAsync (() => {
    const getCollaboratorsSpyOn = spyOn(TestBed.get(CollaboratorsService), 'getAll').and.returnValue(of(collaborators));

    enterFilterKeyword('e');
    tick(500);

    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: 'e', agencyId: 0, serviceLineId: 0 } as CollaboratorFilter,
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
  }));

  it('should show two filters when the \'show filters\' button is clicked', () => {
    const revealAdditionalFiltersEventSpy = spyOn(component, 'switchAdditionalFiltersVisibility');

    element.querySelector<HTMLButtonElement>('.mat-icon-button').click();

    expect(revealAdditionalFiltersEventSpy).toHaveBeenCalled();
    expect(fixture.debugElement.queryAll(By.css('mat-form-field')).length).toBe(3);
  });

  it('should get filtered collaborators and display chips when user is filtering by site and serviceline', async () => {
    const getCollaboratorsSpyOn = spyOn(TestBed.get(CollaboratorsService), 'getAll').and.returnValue(of(collaborators));

    // Filter by site
    await selectFirstElementOfSelectFilter('site');

    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: '', agencyId: 1, serviceLineId: 0 } as CollaboratorFilter,
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
    expect(element.querySelectorAll('.mat-chip').length).toBe(1);
    expect(element.querySelector('.mat-chip').textContent).toContain('Site: Biot');

    // Filter by service line
    await selectFirstElementOfSelectFilter('serviceLine');

    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: '', agencyId: 1, serviceLineId: 2 } as CollaboratorFilter,
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
    expect(element.querySelectorAll('.mat-chip').length).toBe(2);
    expect(element.querySelectorAll('.mat-chip')[1].textContent).toContain('Service Line: Agile & PM cancel');

    // Remove site filter
    const matChip = fixture.debugElement.query(By.css('.mat-chip')).childNodes[1].nativeNode;
    matChip.click();
    fixture.detectChanges();
    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: '', agencyId: 0, serviceLineId: 2 } as CollaboratorFilter,
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
    expect(element.querySelectorAll('.mat-chip').length).toBe(1);
    expect(element.querySelector('.mat-chip').textContent).toContain('Service Line: Agile & PM cancel');
  });

  it('should get next page of collaborators when scroll down', () => {
    const getCollaboratorsSpyOn = spyOn(TestBed.get(CollaboratorsService), 'getAll').and.returnValue(of(collaborators));
    expect(component.filteredCollaborators.length).toBe(2);

    component.onScrollDown();

    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: '', agencyId: 0, serviceLineId: 0 } as CollaboratorFilter,
      page: 2,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
    expect(component.filteredCollaborators.length).toBe(4);
  });

  it('should delete the selected collaborator\'s ggid when a collaboratorDeleteEvent is received', () => {
    expect(component.filteredCollaborators.find(x => x.id === bobCollaborator.id).ggid).not.toBeUndefined();

    component.collaboratorDeleteEvent = of(bobCollaborator);
    component.ngOnInit();

    expect(component.filteredCollaborators.find(x => x.id === bobCollaborator.id).ggid).toBeUndefined();
  });

  it('when the collaborator is created, should filter collaborators to display the one newly created', (() => {
    const route = TestBed.get(ActivatedRoute);
    const expectedGgid = '23232321';
    route.queryParams = of({ggid: expectedGgid});
    const getCollaboratorsSpyOn = spyOn(TestBed.get(CollaboratorsService), 'getAll').and.returnValue(of(collaborators));
    fixture = TestBed.createComponent(MatchCollaboratorsSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(getCollaboratorsSpyOn).toHaveBeenCalledWith({
      filters: { keyword: expectedGgid, agencyId: 0, serviceLineId: 0 } as CollaboratorFilter,
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
  }));

  describe('add collaborator button', () => {
    it('should display add button when user has MATCH_RM role', () => {
      mockUserRole(['MATCH_RM']);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('.bottom-right-absolute-button')).not.toBeNull();
    });

    it('should not display add button when user does not have MATCH_RM role', () => {
      mockUserRole(['MATCH_ADMIN']);
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.bottom-right-absolute-button')).toBeNull();
    });
  });

  describe('Edit collaborator button', () => {
    it(' it should remove  the ggid of the collaborator after deleting it', () => {
      expect(component.filteredCollaborators.find(x => x.id === bobCollaborator.id).ggid).not.toBeUndefined();
      component.deleteCollaboratorProfile(bobCollaborator);
      expect(component.filteredCollaborators.find(x => x.id === bobCollaborator.id).ggid).toBeUndefined();
    });

    it('should refresh sideList Data when collaborater is edited', () => {
      expect(component.filteredCollaborators.findIndex(x => x.id === bobCollaborator.id)).not.toBeUndefined();
      component.editCollaborator(bobCollaborator);
      expect(bobCollaborator).toEqual(jasmine.objectContaining({
        id: 1,
        ggid: 12345,
        firstname: 'Bob',
        lastname: 'Doe',
        fullname: 'Bob Doe',
        email: 'bob.doe@capgemini.com'
      }));

    });
  });

  function enterFilterKeyword(keyword: string) {
    const filterInput = fixture.debugElement.query(By.css('input[name=search]')).nativeElement;
    filterInput.value = keyword;
    const event = new KeyboardEvent('keyup', {});
    filterInput.dispatchEvent(event);
  }

  async function selectFirstElementOfSelectFilter(selectSelector: string) {
    const selectTrigger = fixture.debugElement.query(By.css(`mat-select[id=${selectSelector}]`)).childNodes[0].nativeNode;
    selectTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
      options[0].nativeElement.click();
      fixture.detectChanges();
    });
  }

  function initData(): void {
    serviceLines = [
      {
        id: 1,
        name: 'DIT',
        description: 'Digital Innovation & Technology'
      },
      {
        id: 2,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      }
    ];
    sites = [
      {
        id: 1,
        name: 'Biot',
        postalCode: '06410'
      },
      {
        id: 2,
        name: 'Pau',
        postalCode: '64000'
      }
    ];
    skillLevelNovice = {
      id: 1,
      name: 'Novice',
      order: 1
    };
    skillLevelExpert = {
      id: 2,
      name: 'Expert',
      order: 2
    };
    skillReact = {
      id: 1,
      name: 'React',
      serviceLineId: 1,
      serviceLine: serviceLines[0]
    };
    skillAgile = {
      id: 1,
      name: 'SCRUM',
      serviceLineId: 2,
      serviceLine: serviceLines[1]
    };
    skillEnglish = {
      id: 1,
      name: 'React',
      serviceLineId: 0
    };
    bobCollaborator = {
      id: 1,
      ggid: 12345,
      firstname: 'Bob',
      lastname: 'Doe',
      fullname: 'Bob Doe',
      email: 'bob.doe@capgemini.com',
      agencyId: sites[0].id,
      agency: sites[0],
      serviceLineId: serviceLines[0].id,
      serviceLine: serviceLines[0],
      collaboratorSkills: [
        {
          id: 1,
          skillId: 1,
          skill: skillReact,
          skillLevelId: 1,
          skillLevel: skillLevelNovice
        },
        {
          id: 2,
          skillId: 2,
          skill: skillAgile,
          skillLevelId: 2,
          skillLevel: skillLevelExpert
        }
      ] as CollaboratorSkill[]
    };
    camilleCollaborator = {
      id: 1,
      ggid: 12345,
      firstname: 'Camille',
      lastname: 'Doe',
      fullname: 'Camille Doe',
      email: 'camille.doe@capgemini.com',
      agencyId: sites[1].id,
      agency: sites[1],
      serviceLineId: serviceLines[1].id,
      serviceLine: serviceLines[1],
      collaboratorSkills: [
        {
          id: 3,
          skillId: 1,
          skill: skillReact,
          skillLevelId: 1,
          skillLevel: skillLevelNovice
        },
        {
          id: 4,
          skillId: 3,
          skill: skillEnglish,
          skillLevelId: 2,
          skillLevel: skillLevelExpert
        }
      ] as CollaboratorSkill[]
    };

    collaborators = {
      data: [...[bobCollaborator, camilleCollaborator]] as Collaborator[],
      page: 1,
      size: 1,
      totalItems: 2,
      totalPages: 2
    };
    collaboratorResolverResults = [collaborators, sites, serviceLines];
  }
});
