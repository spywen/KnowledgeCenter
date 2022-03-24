import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceLineService } from '../../shared/services/service-line.service';
import { ServiceLine } from '../../shared/models/ServiceLine';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceLineCreateDialogComponent } from './dialogs/service-line-create-dialog/service-line-create-dialog.component';
import { ServiceLineEditDialogComponent } from './dialogs/service-line-edit-dialog/service-line-edit-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteDialogComponent, DeleteParameters } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rowsAnimation } from 'src/app/shared/animations';

@Component({
  selector: 'app-service-line',
  templateUrl: './service-line.component.html',
  styleUrls: ['./service-line.component.less'],
  animations: [rowsAnimation]
})
export class ServiceLineComponent implements OnInit {

  public filterForm: FormGroup;

  dataSource: MatTableDataSource<ServiceLine>;
  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor(
    private serviceLineService: ServiceLineService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filter: ['']
    });
    this.route.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.serviceLines);
      this.dataSource.sort = this.sort;
    });
  }

  add() {
    const dialogRef = this.dialog.open(ServiceLineCreateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((newServiceLine: ServiceLine) => {
      if (newServiceLine) {
        this.filterForm.reset();
        this.dataSource.data.unshift(newServiceLine);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  edit(serviceLine: ServiceLine) {
    const dialogRef = this.dialog.open(ServiceLineEditDialogComponent, {
      width: '500px',
      data: serviceLine
    });

    dialogRef.afterClosed().subscribe((editedServiceLine: ServiceLine) => {
      if (editedServiceLine) {
        const element = this.dataSource.data.find(x => x.id === serviceLine.id);
        element.name = editedServiceLine.name;
        element.description = editedServiceLine.description;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  delete(serviceLine: ServiceLine) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'service line',
        name: serviceLine.name,
        elementId: serviceLine.id,
        deleteAction: this.serviceLineService.delete(serviceLine.id)
      } as DeleteParameters});

    dialogRef.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(serviceLine);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
