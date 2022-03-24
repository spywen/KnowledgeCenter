import { Component, OnInit, ViewChild } from '@angular/core';
import { Agency } from '../../shared/models/Agency';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent, DeleteParameters } from '../../shared/components/delete-dialog/delete-dialog.component';
import { AgencyService } from '../../shared/services/agency.service';
import { ActivatedRoute } from '@angular/router';
import { AgencyCreateDialogComponent } from './dialogs/agency-create-dialog/agency-create-dialog.component';
import { AgencyEditDialogComponent } from './dialogs/agency-edit-dialog/agency-edit-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rowsAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.less'],
  animations: [rowsAnimation]
})
export class AgencyComponent implements OnInit {

  public filterForm: FormGroup;

  constructor(
    private agencyService: AgencyService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  dataSource: MatTableDataSource<Agency>;
  displayedColumns: string[] = ['name', 'postalcode', 'actions'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: ['']
    });
    this.route.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.agencies);
      this.dataSource.sort = this.sort;
    });
  }

  add() {
    const dialogRefAdd = this.dialog.open(AgencyCreateDialogComponent, {
      width: '500px'
    });

    dialogRefAdd.afterClosed().subscribe((newAgency: any) => {
      if (newAgency) {
        this.filterForm.reset();
        this.dataSource.data.unshift(newAgency);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  edit(agency: Agency) {
    const dialogRefEdit = this.dialog.open(AgencyEditDialogComponent, {
      width: '500px',
      data: agency
    });

    dialogRefEdit.afterClosed().subscribe((editedAgency: any) => {
      if (editedAgency) {
        const element = this.dataSource.data.find(x => x.id === agency.id);
        element.name = editedAgency.name;
        element.postalCode = editedAgency.postalCode;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  delete(agency: Agency): void {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'agency',
        name: agency.name,
        elementId: agency.id,
        deleteAction: this.agencyService.delete(agency.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(agency);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
