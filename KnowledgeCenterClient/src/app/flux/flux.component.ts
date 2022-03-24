import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { IPublication, PublicationLikeType, PublicationCategoryCode, Publication, PublicationEvent, CategoryMetadata } from './models/Publication';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ScrollEventsService } from '../shared/events/scroll-events.service';
import { BasePaginationResponse, BasePaginationRequest } from '../shared/models/BasePagination';
import { FluxService, DEFAULT_FLUX_PUBLICATIONS_PER_PAGE } from './services/flux.service';
import { MatDialog } from '@angular/material';
import { DeleteDialogComponent, DeleteParameters } from '../shared/components/delete-dialog/delete-dialog.component';
import { trigger, state, style, transition, animate, query, stagger, animateChild, sequence, keyframes } from '@angular/animations';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-flux',
  templateUrl: './flux.component.html',
  styleUrls: ['./flux.component.less'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(100, animateChild()))
      ]),
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ]),
    trigger('justClickedEffect', [
      state('initial', style({ transform: 'scale(1)' })),
      transition('false=>true', [
        sequence([
          animate(
            '1s cubic-bezier(.8,-0.6,0.2,1.5)',
            keyframes([
              style({ transform: 'scale(1.5)' }),
              style({ transform: 'scale(1)' }),
            ])
          )
        ])
      ])
    ])
  ]
})
export class FluxComponent implements OnInit, OnDestroy  {

  public PublicationLikeType = PublicationLikeType;
  public CategoryMetadata = CategoryMetadata;
  public fluxForm: FormGroup;
  public publications: Publication[] = [];
  private currentPage = 1;
  private lastPageNumber = 1;
  public isCreating = false;
  public loading = false;
  public IsAnonymous = false;

  @ViewChild('deleteMessage', { static: true })
  public deleteMessageTemplate: TemplateRef<any>;

  /**
   * By default keyvalue to display categoryMetadata is ordering quite randomly elements
   * -> this method give as param of the keyvalue pipe: force to keep defined order of categoryMetadata
   */
  public keepOrder = (a: any, b: any) => a;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private scrollEventsService: ScrollEventsService,
    private fluxService: FluxService,
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private socketService: SocketService) {

      this.hotkeysService.add(new Hotkey('n', (): boolean => {
        this.create();
        return false;
      }));

      this.route.data.subscribe(data => {
        const publicationResolver: BasePaginationResponse<IPublication[]> = data.data;
        this.lastPageNumber = publicationResolver.totalPages;
        this.publications = publicationResolver.data.map(x => new Publication(x));
      });

      this.socketService.start('flux');
  }

  ngOnInit() {

    this.listenSockets();

    this.fluxForm = this.formBuilder.group({
      message: ['', [Validators.required]],
      categoryCode: ['', [Validators.required]],
      isAnonymous: [false, [Validators.required]]
    });

    this.scrollEventsService.listenScrollDown().subscribe(() => {
      if (this.currentPage + 1 > this.lastPageNumber) {
        return;
      }
      this.currentPage++;
      this.getPublications(false);
    });
  }

  public onChangeIsAnonymousToggle(event: any) {
    this.IsAnonymous = event.checked;
  }

  private getPublications(shouldResetPagination: boolean) {
    if (shouldResetPagination) {
      this.currentPage = 1;
    }

    const publicationQuery = {
      page: this.currentPage,
      size: DEFAULT_FLUX_PUBLICATIONS_PER_PAGE
    } as BasePaginationRequest<void>;

    this.fluxService.getPublications(publicationQuery).subscribe((response: BasePaginationResponse<IPublication[]>) => {
      this.lastPageNumber = response.totalPages;

      if (shouldResetPagination) {
        this.publications = response.data.map(x => new Publication(x));
      } else {
        response.data.forEach(publication => {
          this.publications.push(new Publication(publication));
        });
      }
    });
  }

  public create() {
    this.fluxForm.reset();
    this.fluxForm.patchValue({
      categoryCode: PublicationCategoryCode.OTHER,
      message: '',
      isAnonymous: this.IsAnonymous
    });
    this.isCreating = true;
  }

  get categoryCode() { return this.fluxForm.get('categoryCode').value; }

  public changeCategory(next: boolean) {
    const categoryCodes = Object.keys(CategoryMetadata).map(x => String(x));
    const currentCategoryCode = this.categoryCode;
    if (next) {
      if (categoryCodes.indexOf(currentCategoryCode) < categoryCodes.length - 1) {
        this.fluxForm.patchValue({
          categoryCode: categoryCodes[categoryCodes.indexOf(currentCategoryCode) + 1]
        });
      } else {
        this.fluxForm.patchValue({
          categoryCode: categoryCodes[0]
        });
      }
    } else {
      if (categoryCodes.indexOf(currentCategoryCode) > 0) {
        this.fluxForm.patchValue({
          categoryCode: categoryCodes[categoryCodes.indexOf(currentCategoryCode) - 1]
        });
      } else {
        this.fluxForm.patchValue({
          categoryCode: categoryCodes[categoryCodes.length - 1]
        });
      }
    }
  }

  public cancelCreation() {
    this.isCreating = false;
  }

  public publish() {
    this.fluxService.create(this.fluxForm.getRawValue()).subscribe((publication: IPublication) => {
      this.publications.unshift(new Publication(publication));
      this.isCreating = false;
      this.socketService.invoke('Broadcast', PublicationEvent.CREATED, publication);
    });
  }

  public delete(publication: Publication) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        customTemplate: this.deleteMessageTemplate,
        elementId: publication.id,
        deleteAction: this.fluxService.delete(publication.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.publications.splice(this.publications.indexOf(publication), 1);
        this.socketService.invoke('Broadcast', PublicationEvent.DELETED, publication);
      }
    });
  }

  public like(publication: Publication, likeCode: string) {
    publication.setUserLike(likeCode);
    publication.refreshFontSize();

    this.fluxService.likePublication(publication.id, likeCode).subscribe((finalPublication: IPublication) => {
      this.socketService.invoke('Broadcast', PublicationEvent.LIKED, finalPublication);
    });
  }

  public restartSocketConnection() {
    document.location.reload();
  }

  private listenSockets() {
    this.socketService.on('Broadcast', (type: string, publication: IPublication) => {
      switch (type) {
        case PublicationEvent.CREATED:
          this.publications.unshift(new Publication(publication));
          break;
        case PublicationEvent.DELETED:
          if (this.publications.filter(x => x.id === publication.id).length > 0) {
            this.publications.splice(this.publications.indexOf(this.publications.filter(x => x.id === publication.id)[0]), 1);
          }
          break;
        case PublicationEvent.LIKED:
          if (this.publications.filter(x => x.id === publication.id).length > 0) {
            const publicationToUpdate = this.publications.filter(x => x.id === publication.id)[0];
            publicationToUpdate.setLiveLikes(publication);
            publicationToUpdate.refreshFontSize();
          }
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.stop();
  }

}
