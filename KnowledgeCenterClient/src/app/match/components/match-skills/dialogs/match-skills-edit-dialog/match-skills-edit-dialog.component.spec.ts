import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchSkillsEditDialogComponent } from './match-skills-edit-dialog.component';
import { Skill } from '../../../../models/Skill';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { SkillService } from '../../../../services/skill.service';

describe('MatchSkillsEditDialogComponent', () => {
  let component: MatchSkillsEditDialogComponent;
  let fixture: ComponentFixture<MatchSkillsEditDialogComponent>;
  let element: HTMLElement;

  const defaultSkill = {
    id: 1,
    name: 'Agility',
    serviceLineId: 1,
    serviceLine: {
      id: 1,
      name: 'Agile & PM',
      description: 'Agile and Project Management'
    }
  } as Skill;

  const editedSkill = {
    id: 1,
    name: 'SCRUM',
    serviceLineId: 1,
    serviceLine: {
      id: 1,
      name: 'Agile & PM',
      description: 'Agile and Project Management'
    }
  } as Skill;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchSkillsEditDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: defaultSkill },
        { provide: SkillService, useValue: { update: () => of(editedSkill) } },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSkillsEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with a field containing the name of the skill being edited', () => {
    expect(component.skillForm.get('name').value).toBe('Agility');
  });

  it('button should be enabled when the name is defined', () => {
    updateForm('SCRUM');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('button should be disable when the name isn\'t defined', () => {
    updateForm('');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('when editing skill succedeed, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('SCRUM');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(editedSkill);
  });

  function updateForm(name) {
    component.skillForm.controls.name.setValue(name);
  }
});
