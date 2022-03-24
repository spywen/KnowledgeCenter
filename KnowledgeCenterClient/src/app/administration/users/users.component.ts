import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { rowsAnimation } from 'src/app/shared/animations';
import { UserService } from '../../shared/services/user.service';
import { User } from 'src/app/shared/models/User';
import { DeleteDialogComponent, DeleteParameters } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { RolesDialogComponent } from './dialogs/roles/roles-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
  animations: [rowsAnimation]
})

export class UsersComponent implements OnInit {
  public filterForm: FormGroup;
  public  dataSource: MatTableDataSource<User>;
  public  displayedColumns: string[] = ['lastname', 'firstname', 'login', 'isActive', 'actions'];

  constructor(
    private userService: UserService,
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
      this.dataSource = new MatTableDataSource(data.users);
      this.dataSource.sort = this.sort;
    });
  }

  public delete(user: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'user',
        name: user.login,
        elementId: user.id,
        deleteAction: this.userService.delete(user.id)
      } as DeleteParameters
    });

    dialogRef.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(user);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  public editRoles(user: User) {
    this.dialog.open(RolesDialogComponent, { width: '500px', data: user });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}





