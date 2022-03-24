import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MatchSkillsComponent } from './match-skills.component';
import { Skill } from '../../models/Skill';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { MatchSkillsCreateDialogComponent } from './dialogs/match-skills-create-dialog/match-skills-create-dialog.component';
import { SharedModule } from '../../../shared/shared.module';
import { SkillService } from '../../services/skill.service';
import { MatchSkillsEditDialogComponent } from './dialogs/match-skills-edit-dialog/match-skills-edit-dialog.component';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { TokenService } from '../../../shared/services/token.service';

describe('MatchSkillsComponent', () => {
  let component: MatchSkillsComponent;
  let fixture: ComponentFixture<MatchSkillsComponent>;
  let element: HTMLElement;

  let fetchedSkills: Skill[];
  let serviceLines: ServiceLine[];

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
      declarations: [MatchSkillsComponent, MatchSkillsCreateDialogComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: SkillService, useValue: {delete: () => of()}},
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              skills: fetchedSkills,
              serviceLines
            })
          }
        },
        { provide: MatDialog, useValue: {open: () => {}} },
        { provide: TokenService, useValue: { hasOneOfRoles: () => true } } // ADMIN
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchSkillsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty search field and 4 expansion-panels with 1 table and 1 row per table each', () => {
    expect(component.displayedServiceLines.length).toBe(4);
    expect(component.displayedServiceLines[0].dataSource.data.length).toBe(1);
    expect(component.displayedServiceLines[0].serviceLine.id).toBe(1);
    expect(component.displayedServiceLines[1].dataSource.data.length).toBe(1);
    expect(component.displayedServiceLines[1].serviceLine.id).toBe(2);
    expect(component.displayedServiceLines[2].dataSource.data.length).toBe(1);
    expect(component.displayedServiceLines[2].serviceLine.id).toBe(3);
    expect(component.displayedServiceLines[3].dataSource.data.length).toBe(1);
    expect(component.displayedServiceLines[3].serviceLine.id).toBe(0);
  });

  it('should only display 2 opened expansion-panels with 1 table and 1 row per table each when "a" is typed in the filter field', () => {
    enterFilterKeyword('a');
    const filteredDisplayedServiceLine = component.displayedServiceLines.filter(
      displayedServiceLine => displayedServiceLine.visible === true
    );

    expect(filteredDisplayedServiceLine.length).toBe(2);
    expect(component.displayedServiceLines[0].visible).toBe(true);
    expect(component.displayedServiceLines[0].dataSource.data[0].name).toBe('Agility');
    expect(component.displayedServiceLines[1].visible).toBe(false);
    expect(component.displayedServiceLines[2].visible).toBe(true);
    expect(component.displayedServiceLines[2].dataSource.data[0].name).toBe('Analytics');
  });

  it('should close all panels when deleting the text in the filter field when there was something typed', () => {
    enterFilterKeyword('a');
    const filteredDisplayedServiceLine = component.displayedServiceLines.filter(
      displayedServiceLine => displayedServiceLine.visible === true
    );

    expect(filteredDisplayedServiceLine.length).toBe(2);
    expect(component.displayedServiceLines[0].visible).toBe(true);
    expect(component.displayedServiceLines[0].dataSource.data[0].name).toBe('Agility');
    expect(component.displayedServiceLines[1].visible).toBe(false);
    expect(component.displayedServiceLines[2].visible).toBe(true);
    expect(component.displayedServiceLines[2].dataSource.data[0].name).toBe('Analytics');

    enterFilterKeyword('');
    const closedDisplayedServiceLines = component.displayedServiceLines.filter(
      displayedServiceLine => displayedServiceLine.panelOpened === true
    );

    expect(closedDisplayedServiceLines.length).toBe(0);
  });

  it('should display table with actions column when user has MATCH_ADMIN role', () => {
    mockUserRole(['MATCH_ADMIN']);
    component.ngOnInit();

    fixture.debugElement.queryAll(By.css('.mat-expansion-indicator'))[0].nativeElement.click();

    expect(element.querySelectorAll('.actions-column')).not.toBeNull();
  });

  it('should not display table with actions column when user does not have MATCH_ADMIN role', () => {
    mockUserRole(['MATCH_RM', 'MATCH_CAM', 'ADMIN']);
    component.ngOnInit();

    expect(component.columnDefinitions).not.toContain('actions');
  });

  describe('add skill', () => {
    it('should display add button when user has MATCH_ADMIN role', () => {
      mockUserRole(['MATCH_ADMIN']);
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button')).not.toBeNull();
    });

    it('should not display add button when user does not have MATCH_ADMIN role', () => {
      mockUserRole(['MATCH_RM', 'MATCH_CAM', 'ADMIN']);
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button')).toBeNull();
    });

    it('should open the add skill dialog without defaultServiceLine when the plus icon is clicked and no expansion-panel is opened', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(MatchSkillsCreateDialogComponent, {
        width: '500px',
        data: {
          serviceLines,
          defaultServiceLineId: undefined
        }
      });
    });

    it('should open the add skill dialog with a defaultServiceLine when the plus icon is clicked and an expansion-panel is opened', () => {
      component.displayedServiceLines[0].panelOpened = true;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(MatchSkillsCreateDialogComponent, {
        width: '500px',
        data: {
          serviceLines,
          defaultServiceLineId: component.displayedServiceLines[0].serviceLine.id
        }
      });
    });

    it('should not refresh datasource when nothing is created', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterFormResetSpy = spyOn(component.filterForm, 'reset');

      component.add();

      expect(component.displayedServiceLines.length).toBe(4);
      expect(filterFormResetSpy).not.toHaveBeenCalled();
    });

    it('should not refresh datasource when nothing is created and something is typed inside the filter field', () => {
      enterFilterKeyword('a');
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterFormResetSpy = spyOn(component.filterForm, 'reset');

      component.add();

      expect(component.displayedServiceLines.length).toBe(4);
      expect(filterFormResetSpy).not.toHaveBeenCalled();
    });

    it('should refresh the correct datasource and open the correct panel when a skill is created in an existing serviceline ' +
      'when no panel is opened and when nothing is entered in the filter field', () => {
      const newSkill = {
        id: 4,
        name: 'Team Coaching',
        serviceLineId: 1,
        serviceLine: {
          id: 1,
          name: 'Agile & PM',
          description: 'Agile and Project Management'
        } as ServiceLine
      } as Skill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(newSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.add();

      expect(component.displayedServiceLines[0].dataSource.data.length).toBe(2);
      expect(component.displayedServiceLines[0].panelOpened).toBe(true);
      expect(component.displayedServiceLines[1].panelOpened).toBe(false);
      expect(component.displayedServiceLines[2].panelOpened).toBe(false);
    });

    it('should add a new displayedService when none existed before the new skill was created', () => {
      const newSkill = {
        id: 5,
        name: 'UI/UX',
        serviceLineId: 4,
        serviceLine: {
          id: 4,
          name: 'DIT',
          description: 'Digital Innovation and Technology'
        } as ServiceLine
      } as Skill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(newSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.add();

      expect(component.displayedServiceLines.length).toBe(5);
      expect(component.displayedServiceLines[4].serviceLine.id).toBe(4);
      expect(component.displayedServiceLines[4].dataSource.data.length).toBe(1);
      expect(component.displayedServiceLines[4].panelOpened).toBe(true);
    });

    it('should refresh the correct datasource, open the correct panel and close the other panels, when a skill is created in an' +
      'existing service line of the opened panel, and when nothing is entered in the filter field', () => {
      component.displayedServiceLines[0].panelOpened = true;
      const newSkill = {
        id: 4,
        name: 'React',
        serviceLineId: 2,
        serviceLine: {
          id: 2,
          name: 'DTC',
          description: 'Digital Technology And Cloud'
        } as ServiceLine
      } as Skill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(newSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.add();

      expect(component.displayedServiceLines[0].panelOpened).toBe(false);
      expect(component.displayedServiceLines[1].dataSource.data.length).toBe(2);
      expect(component.displayedServiceLines[1].panelOpened).toBe(true);
      expect(component.displayedServiceLines[2].panelOpened).toBe(false);
    });

    it('should open the add skill dialog with no defaultServiceLine when the plus icon is clicked and something is typed in the ' +
      'filter field', () => {
      enterFilterKeyword('a');
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(MatchSkillsCreateDialogComponent, {
        width: '500px',
        data: {
          serviceLines,
          defaultServiceLineId: undefined
        }
      });
    });

    it('should close all the opened panels, clear the filter field and open the correct panel with the updated data source ' +
      'when a new skill is added while something is typed in the filter field', () => {
      enterFilterKeyword('a');
      const newSkill = {
        id: 4,
        name: 'React',
        serviceLineId: 2,
        serviceLine: {
          id: 2,
          name: 'DTC',
          description: 'Digital Technology And Cloud'
        } as ServiceLine
      } as Skill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(newSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.add();

      expect(component.filterApplied).toBe(false);
      expect(fixture.debugElement.query(By.css('input[name=filter]')).nativeElement.value).toBe('');
      expect(component.displayedServiceLines[0].panelOpened).toBe(false);
      expect(component.displayedServiceLines[1].panelOpened).toBe(true);
      expect(component.displayedServiceLines[1].dataSource.data.length).toBe(2);
      expect(component.displayedServiceLines[2].panelOpened).toBe(false);
    });
  });

  describe('edit skill', () => {
    it('should open the edit skill dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = {afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.displayedServiceLines[0].dataSource.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(MatchSkillsEditDialogComponent, {
        width: '500px',
        data: component.displayedServiceLines[0].dataSource.data[0]
      });
    });

    it('should not refresh datasource when nothing is edited', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.displayedServiceLines[0].dataSource.data[0]);

      expect(component.displayedServiceLines.length).toBe(4);
    });

    it('should refresh datasource when agency updated', () => {
      const editedSkill = {
        ...component.displayedServiceLines[0].dataSource.data[0],
        name: 'React Native'
      } as Skill;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedSkill)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.displayedServiceLines[0].dataSource.data[0]);

      expect(component.displayedServiceLines.length).toBe(4);
      expect(component.displayedServiceLines[0].dataSource.data[0].id).toBe(editedSkill.id);
      expect(component.displayedServiceLines[0].dataSource.data[0].name).toBe(editedSkill.name);
      expect(component.displayedServiceLines[0].dataSource.data[0].serviceLineId).toBe(editedSkill.serviceLineId);
      expect(component.displayedServiceLines[0].dataSource.data[0].serviceLine).toBe(editedSkill.serviceLine);
    });
  });

  describe('delete skill', () => {
    it('should open the delete dialog when user click on delete button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.displayedServiceLines[0].dataSource.data[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: component.displayedServiceLines[0].dataSource.data[0].id,
          name: component.displayedServiceLines[0].dataSource.data[0].name,
          type: 'skill'
        })
      }));
    });

    it('should not refresh datasource when nothing deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.displayedServiceLines[0].dataSource.data[0]);

      expect(component.displayedServiceLines[0].dataSource.data.length).toBe(1);
      expect(component.displayedServiceLines[1].dataSource.data.length).toBe(1);
      expect(component.displayedServiceLines[2].dataSource.data.length).toBe(1);
    });

    it('should delete an empty displayedServiceLine when a skill is deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.displayedServiceLines[0].dataSource.data[0]);

      expect(component.displayedServiceLines.findIndex(x => x.serviceLine.id === 1)).toBe(-1);
      expect(component.displayedServiceLines[0].serviceLine.id).toBe(2);
      expect(component.displayedServiceLines[1].serviceLine.id).toBe(3);
    });
  });

  function enterFilterKeyword(keyword: string) {
    const filterInput = fixture.debugElement.query(By.css('input[name=filter]')).nativeElement;
    filterInput.value = keyword;
    const event = new KeyboardEvent('keyup', {});
    filterInput.dispatchEvent(event);
  }

  function initData(): void {
    fetchedSkills = [
      {
        id: 1,
        name: 'Agility',
        serviceLineId: 1,
        serviceLine: {
          id: 1,
          name: 'Agile & PM',
          description: 'Agile and Project Management'
        }
      },
      {
        id: 2,
        name: 'SpringBoot',
        serviceLineId: 2,
        serviceLine: {
          id: 2,
          name: 'DTC',
          description: 'Digital Technology And Cloud'
        }
      },
      {
        id: 3,
        name: 'Analytics',
        serviceLineId: 3,
        serviceLine: {
          id: 3,
          name: 'Data Value',
          description: 'Data Value'
        }
      },
      {
        id: 4,
        name: 'English',
        serviceLineId: 0
      }
    ];
    serviceLines = [
      {
        id: 1,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      } as ServiceLine,
      {
        id: 2,
        name: 'DTC',
        description: 'Digital Technology And Cloud'
      } as ServiceLine,
      {
        id: 3,
        name: 'Data Value',
        description: 'Data Value'
      } as ServiceLine,
      {
        id: 4,
        name: 'DIT',
        description: 'Digital Innovation and Technology'
      } as ServiceLine,
    ];
  }
});
