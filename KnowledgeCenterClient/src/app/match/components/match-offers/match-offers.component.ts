import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ServiceLine } from '../../../shared/models/ServiceLine';
import { CustomerOffer } from '../../models/CustomerOffer';
import { BasePaginationRequest } from '../../../shared/models/BasePagination';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { TokenService } from '../../../shared/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { MatDialog, MatDrawer, MatTableDataSource } from '@angular/material';
import { Skill } from '../../models/Skill';
import { SkillLevel } from '../../models/SkillLevel';
import { CustomerOfferSkill } from '../../models/CustomerOfferSkill';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { checkIconAnimation, rowsAnimation } from '../../../shared/animations';
import { Customer } from '../../models/Customer';
import { CustomerSiteService } from '../../services/customer-site.service';
import { CustomerSiteFilter } from '../../models/CustomerSiteFilter';
import { CustomerSite } from '../../models/CustomerSite';
import { Agency } from '../../../shared/models/Agency';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CustomerOfferStatus } from '../../models/CustomerOfferStatus';
import { CollaboratorsService } from '../../services/collaborators.service';
import { CollaboratorFilter } from '../../models/CollaboratorFilter';
import { Collaborator } from '../../models/Collaborator';
import { MatchOffersSkillEditDialogComponent } from './dialogs/match-offers-skill-edit-dialog/match-offers-skill-edit-dialog.component';
import { DeleteDialogComponent, DeleteParameters } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { Matching } from '../../models/Matching';
import { MatchingService } from '../../services/matching.service';
import { MatchingFilter } from '../../models/MatchingFilter';

@Component({
  selector: 'app-match-offers',
  templateUrl: './match-offers.component.html',
  styleUrls: [ './match-offers.component.less' ],
  animations: [
    trigger('rotateButtonAnimation', [
      state('default', style({transform: 'rotate(0)'})),
      state('rotated', style({transform: 'rotate(-180deg)'})),
      transition('rotated => default', animate('300ms ease-out')),
      transition('default => rotated', animate('300ms ease-out')),
    ]),
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    checkIconAnimation,
    rowsAnimation
  ]
})
export class MatchOffersComponent implements OnInit {

  constructor(
    public tokenService: TokenService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private offerService: OfferService,
    private matchingService: MatchingService,
    private customerSitesService: CustomerSiteService,
    private collaboratorService: CollaboratorsService,
    private dialog: MatDialog,
  ) { }

  @ViewChild('drawer', {static: true}) private drawer: MatDrawer;
  public rotatedState: string;

  public offers: CustomerOffer[];
  public agencies: Agency[];
  public serviceLines: ServiceLine[];
  private skills: Skill[];
  public skillLevels: SkillLevel[];
  public customerOfferStatus: CustomerOfferStatus[];
  public customers: Customer[];

  public customerSites: CustomerSite[];
  public customerAccountManagers: Collaborator[];
  public filteredSkills: Skill[];

  public offerForm: FormGroup;
  public offerFormChanged = false;
  private offerFormSave: any;
  private offerFormSubscription: Subscription;

  public newCustomerOfferSkillForm: FormGroup;
  public customerOfferSkillsOrderChanged = false;
  private customerOfferSkillsSave: CustomerOfferSkill[];

  public editedOfferSubject: Subject<CustomerOffer> = new Subject<CustomerOffer>();
  public deletedOfferSubject: Subject<CustomerOffer> = new Subject<CustomerOffer>();
  public addedOfferSubject: Subject<CustomerOffer> = new Subject<CustomerOffer>();
  public customerOfferInfoModificationSubject: Subject<boolean> = new Subject<boolean>();
  public customerOfferRequiredSkillsModificationSubject: Subject<boolean> = new Subject<boolean>();

  public dataSource: MatTableDataSource<CustomerOfferSkill>;
  public columnsDefinition: string[];
  public footerColumnsDefinition: string[];

  public matchResultDataSource: MatTableDataSource<Matching>;
  public matchResultTableHeaderColumnsDefinition: string[] = [ 'score', 'lastname', 'firstname', 'ggid', 'agency', 'serviceline' ];
  public expandedElement: Matching;

  public isFetchingCustomerSites = false;
  public isFetchingCustomerAccountManagers = false;
  public isFetchingOfferSkills = false;
  public isFetchingMatchResults = false;
  public isNewOffer = false;
  public noMatchResult = false;

  public selectedOffer: CustomerOffer;
  public tabs: string[];
  public selectedTab: FormControl = new FormControl(0);

  @ViewChild('deleteMessage', { static: true })
  public deleteMessageTemplate: TemplateRef<any>;

  static sortSkillLevel(firstObject: SkillLevel, secondObject: SkillLevel) {
    if (firstObject.order < secondObject.order) { return -1; }
    if (firstObject.order > secondObject.order) { return 1; }
    return 0;
  }

  static areEquals(element1: any, element2: any): boolean {
    return JSON.stringify(element1) === JSON.stringify(element2);
  }

  ngOnInit() {
    this.rotatedState = 'default';

    this.route.data.subscribe(data => {
      this.offers = data.customerOfferResolverResults[0].data;
      this.agencies = data.customerOfferResolverResults[1];
      this.serviceLines = data.customerOfferResolverResults[2];
      this.skills = data.customerOfferResolverResults[3];
      this.skillLevels = data.customerOfferResolverResults[4];
      this.customerOfferStatus = data.customerOfferResolverResults[5];
      this.customers = data.customerOfferResolverResults[6].data;
    });

    this.serviceLines.push({
      id: 0,
      name: 'Cross Service Lines',
      description: 'Cross Service Lines'
    } as ServiceLine);

    this.skillLevels.sort((a, b) => MatchOffersComponent.sortSkillLevel(a, b)).reverse();

    if (this.tokenService.hasOneOfRoles([ 'MATCH_CAM' ])) {
      this.columnsDefinition = [ 'skillPriority', 'serviceLine', 'skillName', 'skillLevel', 'actions' ];
      this.footerColumnsDefinition = [ 'serviceLineSelector', 'skillSelector', 'skillLevelSelector', 'skillActions' ];
    } else {
      this.columnsDefinition = [ 'skillPriority', 'serviceLine', 'skillName', 'skillLevel' ];
    }

    this.resetOffer();
  }

  public toggleSideBar() {
    this.rotatedState = (this.rotatedState === 'default' ? 'rotated' : 'default');
    this.drawer.toggle();
  }

  public onResetNewCustomerOfferSkillForm() {
    this.newCustomerOfferSkillForm.reset();
    this.newCustomerOfferSkillForm.controls.skill.disable();
    this.newCustomerOfferSkillForm.controls.skillLevel.disable();
  }

  public onChangeSelectedServiceLine(serviceLineId: number) {
    const collabSkillsIds = this.dataSource.data.map(x => x.skill.id);
    this.filteredSkills = this.skills.filter(x => x.serviceLineId === serviceLineId && !collabSkillsIds.includes(x.id));
    this.newCustomerOfferSkillForm.controls.skill.reset('');
    this.newCustomerOfferSkillForm.controls.skill.enable();
    this.newCustomerOfferSkillForm.controls.skillLevel.enable();
  }

  public onSaveCustomerOfferSkillsNewOrder() {
    this.offerService.updateRequiredSkills(this.selectedOffer.id, this.dataSource.data).subscribe((response) => {
      this.customerOfferSkillsOrderChanged = false;
      this.customerOfferRequiredSkillsModificationSubject.next(this.customerOfferSkillsOrderChanged);
    });
  }

  public onSaveCustomerOfferChanges() {
    const customerOffer = {
      id: this.selectedOffer.id,
      jobTitle: this.offerForm.getRawValue().offerTitle,
      requester: this.offerForm.getRawValue().offerRequester,
      creationDate: new Date(this.offerForm.getRawValue().offerCreationDate),
      missionStartDate: new Date(this.offerForm.getRawValue().offerBeginningDate),
      missionEndDate: new Date(this.offerForm.getRawValue().offerEndingDate),
      mobilityRequired: this.offerForm.getRawValue().offerMobilityRequired,
      onSite: this.offerForm.getRawValue().offerOnSite,
      workFromHome: this.offerForm.getRawValue().offerWorkFromHomeAllowed,
      customerOfferStatusId: this.selectedOffer.customerOfferStatus.id,
      description: this.offerForm.getRawValue().offerDescription,
      customerAccountManagerId: this.offerForm.getRawValue().offerCustomerAccountManager,
      customerSiteId: this.offerForm.getRawValue().offerSite
    } as CustomerOffer;
    this.offerService.updateCustomerOffer(this.selectedOffer.id, customerOffer).subscribe((response) => {
      this.editedOfferSubject.next(response);
      this.offerFormChanged = false;
      this.customerOfferInfoModificationSubject.next(this.offerFormChanged);
      this.offerFormSave = {...this.offerForm.getRawValue()};
    });
  }

  public onDeleteCustomerOffer() {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        customTemplate: this.deleteMessageTemplate,
        elementId: this.selectedOffer.id,
        deleteAction: this.offerService.deleteCustomerOffer(this.selectedOffer.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.resetOffer();
        this.deletedOfferSubject.next(this.selectedOffer);
        this.selectedOffer = undefined;
      }
    });
  }

  public onEditCustomerOfferSkillLevel(skillToEdit: CustomerOfferSkill) {
    const dialogRefEdit = this.dialog.open(MatchOffersSkillEditDialogComponent, {
      width: '500px',
      data: {
        customerOfferId: this.selectedOffer.id,
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

  public onDeleteCustomerOfferSkill(skill: CustomerOfferSkill) {
    const dialogRefDelete = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        type: 'skill',
        name: skill.skill.name,
        elementId: skill.skill.id,
        deleteAction: this.offerService.deleteCustomerOfferSkill(this.selectedOffer.id, skill.skill.id)
      } as DeleteParameters
    });

    dialogRefDelete.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        const index = this.dataSource.data.indexOf(skill);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = this.reorderCustomerOfferSkillsPriorities();
      }
    });
  }

  public onCreateCustomerOffer() {
    const newCustomerOffer = {
      jobTitle: this.offerForm.getRawValue().offerTitle,
      creationDate: new Date(this.offerForm.getRawValue().offerCreationDate),
      missionStartDate: new Date(this.offerForm.getRawValue().offerBeginningDate),
      missionEndDate: new Date(this.offerForm.getRawValue().offerEndingDate),
      customerOfferStatusId: this.offerForm.getRawValue().offerStatus,
      customerAccountManagerId: this.offerForm.getRawValue().offerCustomerAccountManager,
      customerSiteId: this.offerForm.getRawValue().offerSite
    } as CustomerOffer;

    if (this.offerForm.getRawValue().offerRequester) { newCustomerOffer.requester = this.offerForm.getRawValue().offerRequester; }
    if (this.offerForm.getRawValue().offerMobilityRequired) { newCustomerOffer.mobilityRequired = this.offerForm.getRawValue().offerMobilityRequired; }
    if (this.offerForm.getRawValue().offerOnSite) { newCustomerOffer.onSite = this.offerForm.getRawValue().offerOnSite; }
    if (this.offerForm.getRawValue().offerWorkFromHomeAllowed) { newCustomerOffer.workFromHome = this.offerForm.getRawValue().offerWorkFromHomeAllowed; }
    if (this.offerForm.getRawValue().offerDescription) { newCustomerOffer.description = this.offerForm.getRawValue().offerDescription; }

    this.offerService.createCustomerOffer(newCustomerOffer).subscribe((customerOffer) => {
      this.onSetSelectedOffer(customerOffer, false);
      this.addedOfferSubject.next(customerOffer);
    });
  }

  public onAddCustomerOfferSkill() {
    const customerOfferSkillToAdd = {
      skillId: this.newCustomerOfferSkillForm.getRawValue().skill,
      skillLevelId: this.newCustomerOfferSkillForm.getRawValue().skillLevel,
      skillPriority: this.dataSource.data.length + 1,
    } as CustomerOfferSkill;

    this.offerService.addCustomerOfferSkill(this.selectedOffer.id, customerOfferSkillToAdd).subscribe((newCustomerOfferSkill) => {
      this.newCustomerOfferSkillForm.reset();
      this.dataSource.data.push(newCustomerOfferSkill);
      this.dataSource.data = this.dataSource.data;
      this.newCustomerOfferSkillForm.controls.skill.disable();
      this.newCustomerOfferSkillForm.controls.skillLevel.disable();
      this.noMatchResult = false;
    });
  }

  public onChangeSelectedTab(index: number) {
    this.selectedTab.setValue(index);
    if (index === 0) {
      this.dataSource.data = JSON.parse(JSON.stringify(this.dataSource.data));
    } else {
      this.matchResultDataSource.data = JSON.parse(JSON.stringify(this.matchResultDataSource.data));
    }
  }

  public onSetCustomerOfferStatus(statusCode: string) {
    const status = this.customerOfferStatus.find(x => x.code === statusCode);
    this.selectedOffer.customerOfferStatusId = status.id;
    this.selectedOffer.customerOfferStatus = status;
    this.offerForm.patchValue({offerStatus: status.id});
  }

  public onSetSelectedOffer(selectedOffer: CustomerOffer, newOffer: boolean = false) {
    this.selectedTab.setValue(0);
    this.noMatchResult = false;

    if (newOffer) {
      this.isNewOffer = true;
      this.tabs = [ 'Offer' ];
    } else {
      this.isNewOffer = false;
      this.tabs = [ 'Offer', 'Match Results' ];
    }

    this.selectedOffer = selectedOffer;

    if (this.offerFormSubscription) {
      this.offerForm.reset();
      this.offerFormSubscription.unsubscribe();
      this.offerFormChanged = false;
      this.customerOfferInfoModificationSubject.next(this.offerFormChanged);
    }

    this.newCustomerOfferSkillForm = this.formBuilder.group({
      skillServiceLine: [ '', [ Validators.required ] ],
      skill: [ '', [ Validators.required ] ],
      skillLevel: [ '', [ Validators.required ] ]
    });
    this.newCustomerOfferSkillForm.controls.skill.disable();
    this.newCustomerOfferSkillForm.controls.skillLevel.disable();

    this.customerSites = [];
    this.customerAccountManagers = [];

    this.offerForm.patchValue({
      offerCreationDate: selectedOffer.creationDate,
      offerStatus: selectedOffer.customerOfferStatus.id,
      offerRequester: selectedOffer.requester,
      offerTitle: selectedOffer.jobTitle,
      offerDescription: selectedOffer.description,
      offerBeginningDate: selectedOffer.missionStartDate,
      offerEndingDate: selectedOffer.missionEndDate,
      offerMobilityRequired: selectedOffer.mobilityRequired,
      offerOnSite: selectedOffer.onSite,
      offerWorkFromHomeAllowed: selectedOffer.workFromHome
    });

    if (!newOffer) {
      this.offerForm.patchValue({
        offerCustomer: selectedOffer.customerSite.customer.id,
        offerSite: selectedOffer.customerSite.id,
        offerCustomerAccountManagerSite: selectedOffer.customerAccountManager.agency.id,
        offerCustomerAccountManager: selectedOffer.customerAccountManager.id,
      });

      this.setCustomerSites(selectedOffer.customerSite.customerId);
      this.setCustomerAccountManagers(selectedOffer.customerAccountManager.agency.id);

      this.isFetchingOfferSkills = true;
      this.offerService.getRequiredSkills(selectedOffer.id, true).subscribe(requiredSkills => {
        this.dataSource = new MatTableDataSource(requiredSkills);
        this.isFetchingOfferSkills = false;
        this.customerOfferSkillsSave = [ ...requiredSkills ];
        this.customerOfferSkillsOrderChanged = false;
        this.customerOfferRequiredSkillsModificationSubject.next(this.customerOfferSkillsOrderChanged);

        this.isFetchingMatchResults = true;
        this.matchingService.getAll({
            filters: {
              customerOfferId: selectedOffer.id
            } as MatchingFilter
          } as BasePaginationRequest<MatchingFilter>,
          true
        ).subscribe((result) => {
          this.isFetchingMatchResults = false;
          this.updateMatchResults(result.data);
        });
      });

      this.offerFormSave = {...this.offerForm.getRawValue()};

      this.offerFormSubscription = this.offerForm.valueChanges.subscribe((newForm) => {
        this.offerFormChanged = !MatchOffersComponent.areEquals(this.offerFormSave, newForm);
        this.customerOfferInfoModificationSubject.next(this.offerFormChanged);
      });

      if (!this.tokenService.hasOneOfRoles(['MATCH_CAM'])) {
        this.offerForm.disable();
      }
    }
  }

  onNewCustomerOffer() {
    this.resetOffer();
    this.onSetSelectedOffer({
      id: 0,
      jobTitle: '',
      requester: '',
      creationDate: new Date(),
      missionStartDate: new Date(),
      missionEndDate: null,
      mobilityRequired: false,
      onSite: false,
      workFromHome: false,
      customerOfferStatusId: this.customerOfferStatus.find(x => x.code === 'OPEN').id,
      customerOfferStatus: this.customerOfferStatus.find(x => x.code === 'OPEN'),
      description: '',
      customerAccountManagerId: 0,
      customerAccountManager: {},
      customerSiteId: 0,
      customerSite: {},
      customerOfferSkills: []
    } as CustomerOffer, true);
  }

  private setCustomerSites(customerId: number) {
    this.isFetchingCustomerSites = true;
    this.customerSitesService.getAll({
        filters: {
          keyword: '',
          customerId
        } as CustomerSiteFilter
      } as BasePaginationRequest<CustomerSiteFilter>,
      true
    ).subscribe((customerSites) => {
      this.customerSites = customerSites.data;
      this.isFetchingCustomerSites = false;
    });
  }

  public setCustomerAccountManagers(agencyId: number) {
    this.isFetchingCustomerAccountManagers = true;
    this.collaboratorService.getAll({
        filters: {
          keyword: '',
          roleCode: 'MATCH_CAM',
          agencyId,
          serviceLineId: 0
        } as CollaboratorFilter
      } as BasePaginationRequest<CollaboratorFilter>,
      true
    ).subscribe((collaborators) => {
      this.customerAccountManagers = collaborators.data;
      this.isFetchingCustomerAccountManagers = false;
    });
  }

  public drop(event: CdkDragDrop<CustomerOfferSkill[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    const dataSourceWithNewPriorities = this.reorderCustomerOfferSkillsPriorities();
    this.dataSource.data = dataSourceWithNewPriorities;
    this.customerOfferSkillsOrderChanged = !MatchOffersComponent.areEquals(this.customerOfferSkillsSave, dataSourceWithNewPriorities);
    this.customerOfferRequiredSkillsModificationSubject.next(this.customerOfferSkillsOrderChanged);
  }

  public generateNewResult() {
    this.matchingService.generateResult(this.selectedOffer.id).subscribe((results) => {
      if (results.length === 0) {
        this.noMatchResult = true;
      }
      this.updateMatchResults(results);
    });
  }

  private updateMatchResults(results: Matching[]) {
    results.forEach(matching => {
      matching.collaborator.agency = this.agencies.find(x => x.id === matching.collaborator.agencyId);
      matching.collaborator.serviceLine = this.serviceLines.find(x => x.id === matching.collaborator.serviceLineId);
      matching.matchingScorePerSkills.forEach(scorePerSkill => {
        scorePerSkill.skillLevel = this.skillLevels.find(x => x.id === scorePerSkill.skillLevelId);
        scorePerSkill.customerOfferSkill = this.dataSource.data.find(x => x.id === scorePerSkill.customerOfferSkillId);
      });
      matching.matchingScorePerSkills.sort((scoreA, scoreB) => scoreA.customerOfferSkill.skillPriority - scoreB.customerOfferSkill.skillPriority);
    });
    this.matchResultDataSource = new MatTableDataSource(results);
  }

  private reorderCustomerOfferSkillsPriorities() {
    const customerSkillsArrayWithCorrectPriorities = JSON.parse(JSON.stringify(this.dataSource.data));
    for (let i = 0; i < customerSkillsArrayWithCorrectPriorities.length; i++) {
      customerSkillsArrayWithCorrectPriorities[i].skillPriority = i + 1;
    }
    return customerSkillsArrayWithCorrectPriorities;
  }

  private resetOffer() {
    this.offerForm = this.formBuilder.group({
      offerStatus: [ '' ],
      offerCreationDate: [ '', [Validators.required] ],
      offerCustomer: [ '', [Validators.required] ],
      offerSite: [ '', [Validators.required] ],
      offerRequester: [ '' ],
      offerCustomerAccountManagerSite: [ '', [Validators.required] ],
      offerCustomerAccountManager: [ '', [Validators.required] ],
      offerTitle: [ '', [Validators.required] ],
      offerDescription: [ '' ],
      offerBeginningDate: [ '', [Validators.required] ],
      offerEndingDate: [ '', [Validators.required] ],
      offerMobilityRequired: [ false ],
      offerOnSite: [ false ],
      offerWorkFromHomeAllowed: [ false ]
    });

    this.newCustomerOfferSkillForm = this.formBuilder.group({
      skillServiceLine: [ '', [ Validators.required ] ],
      skill: [ '', [ Validators.required ] ],
      skillLevel: [ '', [ Validators.required ] ]
    });
    this.newCustomerOfferSkillForm.controls.skillServiceLine.disable();
    this.newCustomerOfferSkillForm.controls.skill.disable();
    this.newCustomerOfferSkillForm.controls.skillLevel.disable();

    this.dataSource = new MatTableDataSource<CustomerOfferSkill>([]);
    this.matchResultDataSource = new MatTableDataSource<Matching>([]);

    this.offerFormChanged = false;
    this.customerOfferInfoModificationSubject.next(this.offerFormChanged);
    this.customerOfferSkillsOrderChanged = false;
    this.customerOfferRequiredSkillsModificationSubject.next(this.customerOfferSkillsOrderChanged);
  }
}
