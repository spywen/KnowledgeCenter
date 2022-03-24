import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCollaboratorsComponent } from './match-collaborators.component';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Collaborator } from '../../models/Collaborator';
import { CollaboratorSkill } from '../../models/CollaboratorSkill';
import { Agency } from '../../../shared/models/Agency';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { Skill } from '../../models/Skill';
import { SkillLevel } from '../../models/SkillLevel';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from '../../../shared/services/token.service';
import { CollaboratorsService } from '../../services/collaborators.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import {
  MatchCollaboratorsSkillEditDialogComponent
} from './dialogs/match-collaborators-skill-edit-dialog/match-collaborators-skill-edit-dialog.component';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { MatchCollaboratorComponent, CollaboratorCreationOrEditionParameters } from './dialogs/match-user-to-collaborator-dialog/match-collaborator.component';

describe('MatchCollaboratorsComponent', () => {
  let component: MatchCollaboratorsComponent;
  let fixture: ComponentFixture<MatchCollaboratorsComponent>;
  let element: HTMLElement;
  let sites: Agency[];
  let serviceLines: ServiceLine[];
  let skills: Skill[];
  let skillLevels: SkillLevel[];
  let collaborator: Collaborator;
  let user: Collaborator;
  let collaboratorWithSkills: Collaborator;
  let collaboratorResolverResults: any[];

  beforeEach(async(() => {
    initializeTestData();

    TestBed.configureTestingModule({
      declarations: [ MatchCollaboratorsComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ title: 'Collaborators', collaboratorResolverResults}) } },
        { provide: ActivatedRoute, useValue: { data: of({collaboratorResolverResults})}},
        { provide: MAT_DIALOG_DATA, useValue: {
          sites, serviceLines , collaborator : undefined
          }  as CollaboratorCreationOrEditionParameters },
        {
          provide: TokenService, useValue: {
            hasOneOfRoles: () => true,
            getGravatarPerEmail: () => ''
          }
        },
        {
          provide: CollaboratorsService, useValue: {
            get: () => of(collaboratorWithSkills),
            deleteCollaboratorSkill: () => of(),
            deleteCollaborator: () => of()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCollaboratorsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display, tests', () => {
    it('should initially only display an icon and a message at the right of the side-list when no user or collaborator is selected', () => {
      const matSidenavContent = fixture.debugElement.query(By.css('mat-sidenav-content'));
      expect(matSidenavContent.children[0].children.length).toBe(2);
      expect(matSidenavContent.children[0].children[0].name).toBe('mat-icon');
      expect(matSidenavContent.children[0].children[1].childNodes[0].nativeNode.textContent)
        .toBe('Select a collaborator in the list on the left to show its info here.');
    });

    it('if MATCH_RM, when a collaborator is selected, should display collaborator info (with ggid), three dots menu, ' +
      'a table with two rows and the footer of the table should contain three form fields', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const matCardSubtitles = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
      const matCardHeader = fixture.debugElement.query(By.css('mat-card-header'));
      const table = fixture.debugElement.query(By.css('table'));

      expect(fixture.debugElement.query(By.css('mat-card-title')).nativeElement.innerHTML).toBe('Camille Doe');
      expect(matCardSubtitles.length).toBe(3);
      expect(matCardSubtitles[0].nativeElement.innerHTML).toBe('DIT | Biot');
      expect(matCardSubtitles[1].nativeElement.innerHTML).toBe('GGID: 12345');
      expect(matCardSubtitles[2].nativeElement.innerHTML).toBe('camille.doe@capgemini.com');

      expect(matCardHeader.nativeElement.children[4].firstChild.localName).toBe('button'); // three dots menu

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].skill.name).toBe('SCRUM');
      expect(component.dataSource.data[1].skill.name).toBe('React');

      expect(table.nativeElement.children[1].children.length).toBe(2); // two rows in the table
      expect(table.nativeElement.children[2].children.length).toBe(1); // one row (with form fields) inside the table footer
      expect(table.nativeElement.children[2].children[0].children[0].children[0].firstChild.localName).toBe('mat-form-field');
      expect(table.nativeElement.children[2].children[0].children[1].children[0].firstChild.localName).toBe('mat-form-field');
      expect(table.nativeElement.children[2].children[0].children[2].children[0].firstChild.localName).toBe('mat-form-field');
    });

    it('if not MATCH_RM, when a collaborator is selected, should display the same thing as for a MATCH_RM but without the three ' +
      'dots menu or the three form fields at the bottom of the table', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_CAM');

      const matCardSubtitles = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
      const matCardHeader = fixture.debugElement.query(By.css('mat-card-header'));
      const table = fixture.debugElement.query(By.css('table'));

      expect(fixture.debugElement.query(By.css('mat-card-title')).nativeElement.innerHTML).toBe('Camille Doe');
      expect(matCardSubtitles.length).toBe(3);
      expect(matCardSubtitles[0].nativeElement.innerHTML).toBe('DIT | Biot');
      expect(matCardSubtitles[1].nativeElement.innerHTML).toBe('GGID: 12345');
      expect(matCardSubtitles[2].nativeElement.innerHTML).toBe('camille.doe@capgemini.com');

      expect(matCardHeader.nativeElement.children[4]).toBeUndefined(); // no three dots menu

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].skill.name).toBe('SCRUM');
      expect(component.dataSource.data[1].skill.name).toBe('React');

      expect(table.nativeElement.children[1].children.length).toBe(2); // two rows in the table
      expect(table.nativeElement.children[2].children.length).toBe(0); // no row inside the table footer (no form fields)
    });

    it('if MATCH_RM, when a user is selected, should display user info (without ggid), no table, an icon, a text message ' +
      'and a button', () => {
      spyOn(TestBed.get(CollaboratorsService), 'get').and.returnValue(of(user));
      selectUserOrCollabWithSpecificRole(user, 'MATCH_RM');

      const matCardSubtitles = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
      const matCardContent = fixture.debugElement.query(By.css('.not-collab-container'));
      const table = fixture.debugElement.query(By.css('table'));

      expect(fixture.debugElement.query(By.css('mat-card-title')).nativeElement.innerHTML).toBe('Camille Doe');
      expect(matCardSubtitles.length).toBe(2);
      expect(matCardSubtitles[0].nativeElement.innerHTML).toBe('DIT | Biot');
      expect(matCardSubtitles[1].nativeElement.innerHTML).toBe('camille.doe@capgemini.com');

      expect(table).toBeNull();

      expect(matCardContent.nativeElement.children.length).toBe(3);
      expect(matCardContent.nativeElement.children[0].localName).toBe('mat-icon');
      expect(matCardContent.nativeElement.children[1].innerText).toBe('This user has no GGID yet.\n' +
        'Click on the button below to enter a GGID and create a collaborator profile for this user.');
      expect(matCardContent.nativeElement.children[2].localName).toBe('button');
    });

    it('if not MATCH_RM, when a user is selected, should display user info (without ggid), no table, an icon and a text message', () => {
      spyOn(TestBed.get(CollaboratorsService), 'get').and.returnValue(of(user));
      selectUserOrCollabWithSpecificRole(user, 'MATCH_CAM');

      const matCardSubtitles = fixture.debugElement.queryAll(By.css('mat-card-subtitle'));
      const matCardContent = fixture.debugElement.query(By.css('.not-collab-container'));
      const table = fixture.debugElement.query(By.css('table'));

      expect(fixture.debugElement.query(By.css('mat-card-title')).nativeElement.innerHTML).toBe('Camille Doe');
      expect(matCardSubtitles.length).toBe(2);
      expect(matCardSubtitles[0].nativeElement.innerHTML).toBe('DIT | Biot');
      expect(matCardSubtitles[1].nativeElement.innerHTML).toBe('camille.doe@capgemini.com');

      expect(table).toBeNull();

      expect(matCardContent.nativeElement.children.length).toBe(2);
      expect(matCardContent.nativeElement.children[0].localName).toBe('mat-icon');
      expect(matCardContent.nativeElement.children[1].innerText).toBe('This user has no GGID yet, therefore, it isn\'t a collaborator.');
    });
  });

  describe('delete skill tests', () => {
    it('should open the delete dialog when user click on delete skill button', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteSkill(collaborator.collaboratorSkills[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: collaborator.collaboratorSkills[0].skill.id,
          name: collaborator.collaboratorSkills[0].skill.name,
          type: 'skill'
        })
      }));
    });

    it('should not refresh datasource when no skill was deleted', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteSkill(collaborator.collaboratorSkills[0]);

      expect(component.dataSource.data.length).toBe(2);
    });

    it('should refresh datasource when a skill was deleted', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteSkill(component.selectedCollab.collaboratorSkills[0]);

      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.findIndex(x => x.skill.name === 'SCRUM')).toBe(-1);
    });
  });

  describe('edit skill level tests', () => {
    it('should open the edit skill level dialog when user click on edit button', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editSkillLevel(component.selectedCollab.collaboratorSkills[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(MatchCollaboratorsSkillEditDialogComponent, {
        width: '500px',
        data: {
          collaboratorId: component.selectedCollab.id,
          skillToEdit: component.selectedCollab.collaboratorSkills[0],
          skillLevels: component.skillLevels
        }
      });
    });

    it('should not refresh the datasource when the skill level wasn\'t edited', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editSkillLevel(component.selectedCollab.collaboratorSkills[0]);

      expect(component.dataSource.data[0].skillLevel.name).toBe('Expert');
      expect(component.dataSource.data[1].skillLevel.name).toBe('Novice');
    });

    it('should refresh datasource when the skill level was updated', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const editedSkill = {
        ...component.selectedCollab.collaboratorSkills[0],
        skillLevel: skillLevels[1]
      } as CollaboratorSkill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.editSkillLevel(component.selectedCollab.collaboratorSkills[0]);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].id).toBe(editedSkill.id);
      expect(component.dataSource.data[0].skillLevel.id).toBe(editedSkill.skillLevel.id);
      expect(component.dataSource.data[0].skillLevel.name).toBe(editedSkill.skillLevel.name);
    });
  });

  describe('delete collaborator tests', () => {
    it('should open the delete dialog when user click on delete button', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCollaborator();

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: component.selectedCollab.id
        })
      }));
    });

    it('should not do anything when the collaborator wasn\'t delete', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');
      collaborator.collaboratorSkills = component.selectedCollab.collaboratorSkills;

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCollaborator();

      expect(component.selectedCollab).toEqual(collaborator); // the selected collab is still the same as before
      expect(component.dataSource.data.length).toBe(2); // the collaborator skills are still here
    });

    it('should display the user profile of the deleted collaborator when the deletion succeeded', () => {
      selectUserOrCollabWithSpecificRole(collaborator, 'MATCH_RM');
      collaborator.collaboratorSkills = component.selectedCollab.collaboratorSkills;

      spyOn(TestBed.get(CollaboratorsService), 'get').and.returnValue(of(user));

      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.deleteCollaborator();

      fixture.detectChanges();

      const matCardContent = fixture.debugElement.query(By.css('.not-collab-container'));
      const table = fixture.debugElement.query(By.css('table'));

      expect(component.selectedCollab).toEqual(user); // the selectedCollab is now a user (no ggid or collaboratorSkills)
      expect(table).toBeNull(); // no table because no collaboratorSkills anymore
      expect(matCardContent.nativeElement.children.length).toBe(3); // the message saying it's a user is correctly displayed
      expect(matCardContent.nativeElement.children[0].localName).toBe('mat-icon');
      expect(matCardContent.nativeElement.children[1].innerText).toBe('This user has no GGID yet.\n' +
        'Click on the button below to enter a GGID and create a collaborator profile for this user.');
      expect(matCardContent.nativeElement.children[2].localName).toBe('button');
    });
  });

  describe(' and edit  profile collaborator', () => {
    it('should open the edit collaborator  dialog when the edit button is clicked', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      const  sitesList = [] as Agency[];
      openDialogSpy.and.returnValue(dialogRefMock);
      component.onUpdate(collaborator);
      expect(openDialogSpy).toHaveBeenCalledWith(MatchCollaboratorComponent, {
        width: '400px',
        data : {
          sites : sitesList,
          serviceLines,
          collaborator
        }
      });

    });
  });

  function initializeTestData() {
    sites = [
      {
        id: 1,
        name: 'Biot',
        postalCode: '06410'
      } as Agency,
      {
        id: 2,
        name: 'Pau',
        postalCode: '64000'
      } as Agency
    ] as Agency[];

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
    ] as ServiceLine[];

    skills = [
      {
        id: 1,
        name: 'React',
        serviceLineId: 1,
        serviceLine: serviceLines[0]
      } as Skill,
      {
        id: 1,
        name: 'SCRUM',
        serviceLineId: 2,
        serviceLine: serviceLines[1]
      } as Skill
    ] as Skill[];

    skillLevels = [
      {
        id: 1,
        name: 'Novice'
      } as SkillLevel,

      {
        id: 2,
        name: 'Expert'
      } as SkillLevel
    ] as SkillLevel[];

    collaborator = {
      id: 1,
      ggid: 12345,
      firstname: 'Camille',
      lastname: 'Doe',
      fullname: 'Camille Doe',
      email: 'camille.doe@capgemini.com',
      agency: sites[0],
      serviceLine: serviceLines[0]
    } as Collaborator;

    user = {
      id: 2,
      firstname: 'Camille',
      lastname: 'Doe',
      fullname: 'Camille Doe',
      email: 'camille.doe@capgemini.com',
      agency: sites[0],
      serviceLine: serviceLines[0]
    } as Collaborator;

    collaboratorWithSkills = {
      ...collaborator,
      collaboratorSkills: [
        {
          id: 1,
          skillId: 1,
          skill: skills[0],
          skillLevelId: 1,
          skillLevel: skillLevels[0]
        } as CollaboratorSkill,
        {
          id: 2,
          skillId: 2,
          skill: skills[1],
          skillLevelId: 2,
          skillLevel: skillLevels[1]
        } as CollaboratorSkill
      ] as CollaboratorSkill[]
    } as Collaborator;

    collaboratorResolverResults = [{}, [], serviceLines, skills, skillLevels];
  }

  function selectUserOrCollabWithSpecificRole(userOrCollabToSelect: any, role: string) {
    mockUserRole([role]);
    component.onSetSelectedCollaborator(userOrCollabToSelect);
    fixture.detectChanges();
  }

  function mockUserRole(userRoles: string[]) {
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.callFake((requiredRoles: string[]) => {
      let isAllowed = false;
      requiredRoles.forEach(requiredRole => {
        if (userRoles.includes(requiredRole)) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
  }
});
