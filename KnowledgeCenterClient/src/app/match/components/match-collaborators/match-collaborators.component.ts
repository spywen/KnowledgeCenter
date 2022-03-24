import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TokenService } from '../../../shared/services/token.service';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDrawer, MatTableDataSource } from '@angular/material';
import { Collaborator } from '../../models/Collaborator';
import { CollaboratorSkill } from '../../models/CollaboratorSkill';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillLevel } from '../../models/SkillLevel';
import { Skill } from '../../models/Skill';
import { ActivatedRoute } from '@angular/router';
import { CollaboratorsService } from '../../services/collaborators.service';
import { DeleteDialogComponent, DeleteParameters } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { checkIconAnimation, rowsAnimation } from 'src/app/shared/animations';
import {
  MatchCollaboratorsSkillEditDialogComponent
} from './dialogs/match-collaborators-skill-edit-dialog/match-collaborators-skill-edit-dialog.component';
import { Subject } from 'rxjs';
import { Agency } from 'src/app/shared/models/Agency';
import { BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import {
  MatchCollaboratorComponent, CollaboratorCreationOrEditionParameters
} from './dialogs/match-user-to-collaborator-dialog/match-collaborator.component';


@Component({
  selector: 'app-match-collaborators',
  templateUrl: './match-collaborators.component.html',
  styleUrls: [ './match-collaborators.component.less' ],
  animations: [
    trigger('rotateButtonAnimation', [
      state('default', style({transform: 'rotate(0)'})),
      state('rotated', style({transform: 'rotate(-180deg)'})),
      transition('rotated => default', animate('300ms ease-out')),
      transition('default => rotated', animate('300ms ease-out')),
    ]),
    checkIconAnimation,
    rowsAnimation
  ]
})
export class MatchCollaboratorsComponent implements OnInit {
  public sites: Agency[];
  public serviceLines: ServiceLine[];
  public collaborator: Collaborator;
  public filteredCollaborators: Collaborator[];
  public collaborators: BasePaginationResponse<Collaborator[]>;
  public filtersForm: FormGroup;
  public editedCollaboratorSubject: Subject<Collaborator> = new Subject<Collaborator>();

  @ViewChild('deleteMessage', { static: true })
  public deleteMessageTemplate: TemplateRef<any>;

  constructor(
    public tokenService: TokenService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private collaboratorsService: CollaboratorsService
  ) { }

  @ViewChild('drawer', {static: true}) private drawer: MatDrawer;
  private skills: Skill[];
  public eventsSubject: Subject<Collaborator> = new Subject<Collaborator>();
  public selectedCollab: Collaborator;
  public rotatedState: string;
  public newCollaboratorSkillForm: FormGroup;
  public skillLevels: SkillLevel[];
  public filteredSkills: Skill[];
  public dataSource: MatTableDataSource<CollaboratorSkill>;
  public columnsDefinition: string[];
  public isFetchingCollaboratorSkills: boolean;

  static sortAlphabeticallyByServiceLineName(firstObject: CollaboratorSkill, secondObject: CollaboratorSkill) {
    if (firstObject.skill.serviceLine.name < secondObject.skill.serviceLine.name) { return -1; }
    if (firstObject.skill.serviceLine.name > secondObject.skill.serviceLine.name) { return 1; }
    return 0;
  }

  static sortSkillLevel(firstObject: SkillLevel, secondObject: SkillLevel) {
    if (firstObject.order < secondObject.order) { return -1; }
    if (firstObject.order > secondObject.order) { return 1; }
    return 0;
  }

  static addCrossServiceLinesToSkillArray(skillArray: CollaboratorSkill[]) {
    skillArray.forEach(x => {
      if (x.skill.serviceLine === undefined) {
        x.skill.serviceLine = {
          id: 0,
          name: 'Cross Service Lines',
          description: 'Cross Service Lines'
        } as ServiceLine;
      }
    });

    return skillArray;
  }

  ngOnInit() {
    this.drawer.toggle();
    this.rotatedState = 'default';
    this.route.data.subscribe(data => {
      this.collaborators = data.collaboratorResolverResults[0];
      this.sites = data.collaboratorResolverResults[1];
      this.serviceLines = data.collaboratorResolverResults[2];
      this.skills = data.collaboratorResolverResults[3];
      this.skillLevels = data.collaboratorResolverResults[4];
    });

    this.skillLevels.sort((a, b) => MatchCollaboratorsComponent.sortSkillLevel(a, b)).reverse();

    if (this.tokenService.hasOneOfRoles([ 'MATCH_RM' ])) {
      this.columnsDefinition = [ 'serviceLine', 'skillName', 'skillLevel', 'actions' ];
    } else {
      this.columnsDefinition = [ 'serviceLine', 'skillName', 'skillLevel' ];
    }

    this.serviceLines.push({
      id: 0,
      name: 'Cross Service Lines',
      description: 'Cross Service Lines'
    } as ServiceLine);

    this.newCollaboratorSkillForm = this.formBuilder.group({
      serviceLine: [ '', [ Validators.required ] ],
      skill: [ '', [ Validators.required ] ],
      skillLevel: [ '', [ Validators.required ] ]
    });
    this.newCollaboratorSkillForm.controls.skill.disable();
    this.newCollaboratorSkillForm.controls.skillLevel.disable();
  }

  toggleSideBar() {
    this.rotatedState = (this.rotatedState === 'default' ? 'rotated' : 'default');
    this.drawer.toggle();
  }

  changeSelectedServiceLine(serviceLineId: number) {
    const collabSkillsIds = this.dataSource.data.map(x => x.skill.id);
    this.filteredSkills = this.skills.filter(x =>
      x.serviceLineId === serviceLineId && !collabSkillsIds.includes(x.id)
    );
    this.newCollaboratorSkillForm.controls.skill.reset('');
    this.newCollaboratorSkillForm.controls.skill.enable();
    this.newCollaboratorSkillForm.controls.skillLevel.enable();
  }

  onSetSelectedCollaborator(selectedCollab: Collaborator) {
    this.dataSource = new MatTableDataSource([]);
    this.selectedCollab = selectedCollab;
    this.newCollaboratorSkillForm = this.formBuilder.group({
      serviceLine: [ '', [ Validators.required ] ],
      skill: [ '', [ Validators.required ] ],
      skillLevel: [ '', [ Validators.required ] ]
    });
    this.newCollaboratorSkillForm.controls.skill.disable();
    this.newCollaboratorSkillForm.controls.skillLevel.disable();
    this.isFetchingCollaboratorSkills = true;
    this.collaboratorsService.get(selectedCollab.id, true).subscribe(collaborator => {
      if (collaborator.collaboratorSkills !== undefined) {
        this.selectedCollab.collaboratorSkills = collaborator.collaboratorSkills;
        this.selectedCollab.collaboratorSkills = MatchCollaboratorsComponent.addCrossServiceLinesToSkillArray(
          this.selectedCollab.collaboratorSkills
        );
        this.selectedCollab.collaboratorSkills.sort((a, b) => MatchCollaboratorsComponent.sortAlphabeticallyByServiceLineName(a, b));
        this.dataSource = new MatTableDataSource(this.selectedCollab.collaboratorSkills);
      } else {
        this.selectedCollab.collaboratorSkills = [];
      }
      this.isFetchingCollaboratorSkills = false;
    });
  }

  editSkillLevel(skillToEdit: CollaboratorSkill) {
    const dialogRefEdit = this.dialog.open(MatchCollaboratorsSkillEditDialogComponent, {
      width: '500px',
      data: {
        collaboratorId: this.selectedCollab.id,
        skillToEdit,
        skillLevels: this.skillLevels
      }
    });

    dialogRefEdit.afterClosed().subscribe((editedSkill: any) => {
      if (editedSkill) {
        const skill = this.dataSource.data.find(x => x.skillId === editedSkill.skillId);
        skill.skillLevel.id = skill.skillLevelId = editedSkill.skillLevel.id;
        skill.skillLevel.name = editedSkill.skillLevel.name;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  deleteSkill(skill: CollaboratorSkill) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'skill',
        name: skill.skill.name,
        elementId: skill.skill.id,
        deleteAction: this.collaboratorsService.deleteCollaboratorSkill(this.selectedCollab.id, skill.skill.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(skill);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  addSkill() {
    const skillToAdd = {
      skillId: this.newCollaboratorSkillForm.getRawValue().skill,
      skillLevelId: this.newCollaboratorSkillForm.getRawValue().skillLevel
    } as CollaboratorSkill;

    this.collaboratorsService.addCollaboratorSkill(this.selectedCollab.id, skillToAdd).subscribe((newCollaboratorSkill) => {
      this.newCollaboratorSkillForm.reset();
      this.dataSource.data.unshift(newCollaboratorSkill);
      this.dataSource.data = this.dataSource.data;
      this.newCollaboratorSkillForm.controls.skill.disable();
      this.newCollaboratorSkillForm.controls.skillLevel.disable();
    });
  }

  resetNewCollaboratorSkillForm() {
    this.newCollaboratorSkillForm.reset();
  }

  deleteCollaborator() {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        customTemplate: this.deleteMessageTemplate,
        elementId: this.selectedCollab.id,
        deleteAction: this.collaboratorsService.deleteCollaborator(this.selectedCollab.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.collaboratorsService.get(this.selectedCollab.id, true).subscribe(collaborator => {
          this.selectedCollab = collaborator;
          this.eventsSubject.next(collaborator);
        });
      }
    });
  }

  public onUpdate(collaborator: Collaborator): void {
    const dialogRef = this.dialog.open(MatchCollaboratorComponent, {
      width: '400px',
      data: {
        sites: this.sites,
        serviceLines: this.serviceLines,
        collaborator
      } as CollaboratorCreationOrEditionParameters
    });
    dialogRef.afterClosed().subscribe((editedCollaborator: Collaborator) => {
      if (editedCollaborator) {
        this.editedCollaboratorSubject.next(editedCollaborator);
        this.selectedCollab = editedCollaborator;
      }
    });
  }
}
