import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatTableDataSource} from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Skill } from '../../models/Skill';
import { rowsAnimation } from '../../../shared/animations';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { SkillService } from '../../services/skill.service';
import { MatchSkillsEditDialogComponent } from './dialogs/match-skills-edit-dialog/match-skills-edit-dialog.component';
import { DeleteDialogComponent, DeleteParameters } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { MatchSkillsCreateDialogComponent } from './dialogs/match-skills-create-dialog/match-skills-create-dialog.component';
import { TokenService } from '../../../shared/services/token.service';

export interface DisplayedServiceLine {
  serviceLine: ServiceLine;
  dataSource: MatTableDataSource<Skill>;
  panelOpened: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-match-skills',
  templateUrl: './match-skills.component.html',
  styleUrls: ['./match-skills.component.less'],
  animations: [rowsAnimation]
})
export class MatchSkillsComponent implements OnInit {

  private fetchedSkills: Skill[];
  private serviceLines: ServiceLine[];
  public filterForm: FormGroup;
  public displayedServiceLines: DisplayedServiceLine[] = [];
  public columnDefinitions: string[];
  public filterApplied = false;

  constructor(
    private skillService: SkillService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public tokenService: TokenService
  ) { }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: ['']
    });
    if (this.tokenService.hasOneOfRoles(['MATCH_ADMIN'])) {
      this.columnDefinitions = ['name', 'actions'];
    } else {
      this.columnDefinitions = ['name'];
    }
    this.route.data.subscribe(data => {
      this.fetchedSkills = data.skills;
      this.serviceLines = data.serviceLines;
      this.serviceLines.push({
        id: 0,
        name: 'Cross Service-Lines',
        description: 'Cross Service-lines'
      } as ServiceLine);
      this.initializedDisplayedServiceLines();
    });
  }

  edit(skill: Skill) {
    const dialogRefEdit = this.dialog.open(MatchSkillsEditDialogComponent, {
      width: '500px',
      data: skill
    });

    dialogRefEdit.afterClosed().subscribe((editedSkill: Skill) => {
      if (editedSkill) {
        const targetDataSource = this.displayedServiceLines.find(x => x.dataSource.data.find(y => y.id === skill.id) === skill).dataSource;
        const element = targetDataSource.data.find(x => x.id === skill.id);
        element.name = editedSkill.name;
        targetDataSource.data = targetDataSource.data;
      }
    });
  }

  delete(skill: Skill): void {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'skill',
        name: skill.name,
        elementId: skill.id,
        deleteAction: this.skillService.delete(skill.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const displayedServiceLine = this.displayedServiceLines.find(x => x.dataSource.data.find(y => y.id === skill.id) === skill);
        const displayedServiceLineIndex = this.displayedServiceLines.indexOf(displayedServiceLine);
        const targetDataSource = displayedServiceLine.dataSource;
        const index = targetDataSource.data.indexOf(skill);
        targetDataSource.data.splice(index, 1);
        targetDataSource.data = targetDataSource.data;

        if (targetDataSource.data.length === 0) {
          this.displayedServiceLines.splice(displayedServiceLineIndex, 1);
        }
      }
    });
  }

  add(): void {
    const openedDisplayedServiceLine = this.displayedServiceLines.find(x => x.panelOpened === true);
    const dialogRefAdd = this.dialog.open(MatchSkillsCreateDialogComponent, {
      width: '500px',
      data: {
        serviceLines: this.serviceLines,
        defaultServiceLineId: openedDisplayedServiceLine !== undefined && this.filterApplied === false ?
          openedDisplayedServiceLine.serviceLine.id :
          undefined
      }
    });

    dialogRefAdd.afterClosed().subscribe((newSkill: Skill) => {
      if (newSkill) {
        if (this.filterApplied) {
          this.resetFilter();
        }

        if (openedDisplayedServiceLine !== undefined) {
          openedDisplayedServiceLine.panelOpened = false;
        }

        const displayedServiceLineOfAddedSkill = this.displayedServiceLines.find(x => x.serviceLine.id === newSkill.serviceLineId);
        if (displayedServiceLineOfAddedSkill !== undefined) {
          displayedServiceLineOfAddedSkill.panelOpened = true;
          displayedServiceLineOfAddedSkill.dataSource.data.unshift(newSkill);
          displayedServiceLineOfAddedSkill.dataSource.data = displayedServiceLineOfAddedSkill.dataSource.data;
        } else {
          this.displayedServiceLines.push({
            serviceLine: this.serviceLines.find(x => x.id === newSkill.serviceLineId),
            dataSource: new MatTableDataSource<Skill>([newSkill]),
            panelOpened: true,
            visible: true
          });
        }
      }
    });
  }

  applyFilter(filterValue: string) {
    this.filterApplied = filterValue !== '';
    this.displayedServiceLines.forEach(displayedServiceLine => {
      displayedServiceLine.dataSource.filter = filterValue.trim().toLowerCase();
      if (displayedServiceLine.dataSource.filteredData.length === 0) {
        displayedServiceLine.visible = false;
      }

      if (displayedServiceLine.dataSource.filteredData.length !== 0) {
        displayedServiceLine.visible = true;
        displayedServiceLine.panelOpened = true;
      }

      if (filterValue === '') {
        displayedServiceLine.panelOpened = false;
      }
    });
  }

  private initializedDisplayedServiceLines() {
    this.fetchedSkills.forEach(skill => {
      const skillDisplayedServiceLine = this.displayedServiceLines.find(x => x.serviceLine.id === skill.serviceLineId);
      if (!skillDisplayedServiceLine) {
        if (skill.serviceLineId === 0) {
          this.displayedServiceLines.push({
            serviceLine: {
              id: 0,
              name: 'Cross Service lines',
              description: 'Cross Service lines'
            },
            dataSource: new MatTableDataSource<Skill>([skill]),
            panelOpened: false,
            visible: true
          });
        } else {
          this.displayedServiceLines.push({
            serviceLine: skill.serviceLine,
            dataSource: new MatTableDataSource<Skill>([skill]),
            panelOpened: false,
            visible: true
          });
        }
      } else {
        skillDisplayedServiceLine.dataSource.data.unshift(skill);
      }
    });
  }

  private resetFilter() {
    this.filterForm.reset();
    this.filterApplied = false;
    this.displayedServiceLines.forEach(displayedServiceLine => {
      displayedServiceLine.panelOpened = false;
      displayedServiceLine.visible = true;
      displayedServiceLine.dataSource.filter = '';
    });
  }
}
