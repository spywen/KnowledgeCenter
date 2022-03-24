import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchSkillsCreateDialogComponent } from './match-skills-create-dialog.component';
import { Skill } from '../../../../models/Skill';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SkillService } from '../../../../services/skill.service';
import { of } from 'rxjs';
import { ServiceLine } from '../../../../../shared/models/ServiceLine';

describe('MatchSkillsCreateDialogComponent', () => {
  let component: MatchSkillsCreateDialogComponent;
  let fixture: ComponentFixture<MatchSkillsCreateDialogComponent>;
  let element: HTMLElement;

  const createdSkill = {
    id: 1,
    name: 'Agility',
    serviceLineId: 1,
    serviceLine: {
      id: 1,
      name: 'Agile & PM',
      description: 'Agile and Project Management'
    }
  } as Skill;

  const serviceLines: ServiceLine[] = [
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

  const dialogDatas = {
    defaultServiceLineId: undefined,
    serviceLines
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchSkillsCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: SkillService, useValue: { create: () => of(createdSkill) } },
        { provide: MAT_DIALOG_DATA, useValue: dialogDatas }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSkillsCreateDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display a form with one empty text field and one selection box with no selected item ' +
    'when no defaultServiceLineId was given', () => {
    expect(component.skillForm.get('name').value).toBe('');
    expect(component.skillForm.get('serviceLineId').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', 1);
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no serviceLineId is provided', () => {
    updateForm('React', '');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and serviceLineId are defined', () => {
    updateForm('React', 1);
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when adding a skill succedeed, should close dialog', (() => {
    const newSkill = {
      id: 1,
      name: 'Agility',
      serviceLineId: 1,
      serviceLine: {
        id: 1,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      }
    } as Skill;
    spyOn(TestBed.get(SkillService), 'create').and.returnValue(of(newSkill));
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('Agility', 1);
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(newSkill);
  }));

  function updateForm(name: string, serviceLineId: any) {
    component.skillForm.controls.name.setValue(name);
    component.skillForm.controls.serviceLineId.setValue(serviceLineId);
  }
});
