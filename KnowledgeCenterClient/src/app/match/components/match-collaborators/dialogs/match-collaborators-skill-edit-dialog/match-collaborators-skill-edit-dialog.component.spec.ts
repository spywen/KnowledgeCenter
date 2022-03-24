import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCollaboratorsSkillEditDialogComponent } from './match-collaborators-skill-edit-dialog.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Skill } from '../../../../models/Skill';
import { CollaboratorSkill } from '../../../../models/CollaboratorSkill';
import { ServiceLine } from '../../../../../shared/models/ServiceLine';
import { SkillLevel } from '../../../../models/SkillLevel';
import { CollaboratorsService } from '../../../../services/collaborators.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('MatchCollaboratorsSkillEditDialogComponent', () => {
  let component: MatchCollaboratorsSkillEditDialogComponent;
  let fixture: ComponentFixture<MatchCollaboratorsSkillEditDialogComponent>;
  let element: HTMLElement;

  let serviceLine: ServiceLine;
  let skill: Skill;
  let skillLevels: SkillLevel[];
  let skillToEdit: CollaboratorSkill;
  let editedCollaboratorSkill: CollaboratorSkill;

  beforeEach(async(() => {
    initializeTestData();

    TestBed.configureTestingModule({
      declarations: [ MatchCollaboratorsSkillEditDialogComponent ],
      imports: [
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { collaboratorId: 1, skillToEdit, skillLevels } },
        { provide: CollaboratorsService, useValue: { updateCollaboratorSkillLevel: () => of(editedCollaboratorSkill) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCollaboratorsSkillEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with one field containing the name of the current skill level of the skill being edited ' +
    'and the title of the dialog should show the name of the skill', () => {
    fixture.detectChanges();

    const skillLevelSelect = fixture.debugElement.query(By.css('.skill-level-select')).nativeElement;
    const dialogTitle = fixture.debugElement.query(By.css('.mat-dialog-title')).nativeElement;

    expect(dialogTitle.textContent).toBe('Update skill level for SCRUM');
    expect(skillLevelSelect.textContent).toBe('Novice');
    expect(component.collaboratorSkillForm.get('skillId').value).toBe(1);
    expect(component.collaboratorSkillForm.get('skillLevelId').value).toBe(1);
  });

  it('when editing the skill level succedeed, should close the dialog', async () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    fixture.detectChanges();

    await selectSecondElementFromSkillLevelSelect();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(editedCollaboratorSkill);
  });

  async function selectSecondElementFromSkillLevelSelect() {
    const selectTrigger = fixture.debugElement.query(By.css('.skill-level-select')).childNodes[0].nativeNode;
    selectTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable().then(() => {
      const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
      options[1].nativeElement.click();
      fixture.detectChanges();
    });
  }

  function initializeTestData() {
    serviceLine = {
      id: 1,
      name: 'Agile & PM',
      description: 'Agile & PM'
    } as ServiceLine;

    skill = {
      id: 1,
      name: 'SCRUM',
      serviceLineId: 1,
      serviceLine,
    } as Skill;

    skillLevels = [
      {
        id: 1,
        name: 'Novice'
      } as SkillLevel,
      {
        id: 2,
        name: 'Expert'
      }
    ] as SkillLevel[];

    skillToEdit = {
      id: 1,
      skillId: skill.id,
      skill,
      skillLevelId: skillLevels[0].id,
      skillLevel: skillLevels[0]
    } as CollaboratorSkill;

    editedCollaboratorSkill = Object.create(skillToEdit);
    editedCollaboratorSkill.skillLevelId = skillLevels[1].id;
    editedCollaboratorSkill.skillLevel = skillLevels[1];
  }
});
