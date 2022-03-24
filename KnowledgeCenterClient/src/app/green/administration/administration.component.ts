import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationsService } from '../services/publications.service';
import { Publication } from '../models/Publication';
import { PublicationCreateEditDialogComponent, PublicationDialogParameters } from '../dialogs/publication-create-edit-dialog/publication-create-edit-dialog.component';
import { DeleteDialogComponent, DeleteParameters } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.less']
})
export class AdministrationComponent implements OnInit {

  private ardoisePath = '/green/ardoise/';
  public dataSource: MatTableDataSource<Publication>;
  public publicationTypes: Array<SimpleEnum>;
  public displayedColumns: string[] = ['publicationType', 'publicationDate', 'message', 'actions'];
  constructor(
    private publicationService: PublicationsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data.loadPublicationsObjectResolver.publications);
      this.publicationTypes = data.loadPublicationsObjectResolver.publicationTypes;
    });
  }

  public add() {
    const dialogRefAdd = this.dialog.open(PublicationCreateEditDialogComponent, {
      width: '750px',
      data: {
        publicationTypes : this.publicationTypes
      } as PublicationDialogParameters
    });

    dialogRefAdd.afterClosed().subscribe((newPublication: Publication) => {
      if (newPublication) {
        this.reloadPublications();
      }
    });
  }

  public edit(publication: Publication) {
    const dialogRefAdd = this.dialog.open(PublicationCreateEditDialogComponent, {
      width: '750px',
      data: {
        publication,
        publicationTypes : this.publicationTypes
      } as PublicationDialogParameters
    });

    dialogRefAdd.afterClosed().subscribe((editedPublication: Publication) => {
      if (editedPublication) {
        this.reloadPublications();
      }
    });
  }

  public delete(publication: Publication) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'publication',
        name: publication.message,
        elementId: publication.id,
        deleteAction: this.publicationService.delete(publication.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.reloadPublications();
      }
    });
  }

  private reloadPublications() {
    this.publicationService.getAllPublications().subscribe((publications: Publication[]) => {
      this.dataSource.data = publications;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    });
  }

  public preview(publicationId: number) {
    this.router.navigateByUrl(this.ardoisePath.concat(publicationId.toString()));
  }

}
