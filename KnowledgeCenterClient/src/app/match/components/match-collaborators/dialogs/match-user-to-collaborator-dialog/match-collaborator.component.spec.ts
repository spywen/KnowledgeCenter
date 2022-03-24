import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCollaboratorComponent, CollaboratorCreationOrEditionParameters } from './match-collaborator.component';
import { ReactiveFormsModule} from '@angular/forms';
import { Collaborator } from 'src/app/match/models/Collaborator';
import { Agency } from 'src/app/shared/models/Agency';
import { ServiceLine } from 'src/app/shared/models/ServiceLine';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../../../shared/shared.module';
import { CollaboratorsService } from 'src/app/match/services/collaborators.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

describe('MatchCollaboratorComponent', () => {
  let component: MatchCollaboratorComponent;
  let fixture: ComponentFixture<MatchCollaboratorComponent>;
  let element: HTMLElement;
  let agencies: Agency[];
  let serviceLines: ServiceLine[];
  let defaultCollaborator: Collaborator;

  describe('create collaborator', () => {
    beforeEach((() => {
      initData();

      TestBed.configureTestingModule({
        declarations: [ MatchCollaboratorComponent ],
        imports: [
          ReactiveFormsModule,
          SharedModule,
          BrowserAnimationsModule,
          RouterTestingModule
        ] ,
        providers: [
          { provide: MatDialogRef, useValue: { close: () => {} } },
          { provide: MAT_DIALOG_DATA, useValue: {
             sites: agencies, serviceLines , collaborator : undefined
             }  as CollaboratorCreationOrEditionParameters },
          { provide: CollaboratorsService, useValue: {
              create: () => of(defaultCollaborator)
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(MatchCollaboratorComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initially display an empty form and the add button should be disabled', () => {
      expect(component.createCollaboratorForm.get('firstname').value).toBe('');
      expect(component.createCollaboratorForm.get('lastname').value).toBe('');
      expect(component.createCollaboratorForm.get('ggid').value).toBe('');
      expect(component.createCollaboratorForm.get('email').value).toBe('');
      expect(component.createCollaboratorForm.get('agency').value).toBe('');
      expect(component.createCollaboratorForm.get('serviceLineId').value).toBe('');
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no Firstname is provided', () => {
      updateForm('', 'doe', 12321232 , 'collabEmail@capgemini.com', agencies[0] ,  serviceLines[0]);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no lastname is provided', () => {
      updateForm('bob', '', 12321232 , 'collabEmail@capgemini.com', agencies[0] , serviceLines[0]);
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no ggid is provided', () => {
      updateForm('bob', 'doe', null, 'collabEmail@capgemini.com',  agencies[0] ,  serviceLines[0]);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be disabled when no email is provided', () => {
      updateForm('bob', 'doe', 12321232 , '', agencies[0] ,  serviceLines[0]);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();

    });

    it('button should be disabled when no agency is provided', () => {
      updateForm('bob', 'doe', 12321232, 'collabEmail@capgemini.com',  null ,  serviceLines[0]);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
    });

    it('button should be enabled  when no serviceLine is provided', () => {
      updateForm('bob', 'doe', 12321232, 'collabEmail@capgemini.com', agencies[0] ,  null);
      fixture.detectChanges();
      expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
    });

    it('when adding a collaborator succedeed, should close dialog', (() => {
      const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
      const routerSpy = spyOn(TestBed.get(Router), 'navigate');
      updateForm('bob', 'doe', 12321232 , 'bDoe@capgemini.com', agencies[0], serviceLines[0]);
      fixture.detectChanges();
      element.querySelector<HTMLButtonElement>('button[type=submit]').click();
      expect(routerSpy).toHaveBeenCalledWith(['match/collaborators'], { queryParams: { ggid: defaultCollaborator.ggid  } });
      expect(dialogCloseSpy).toHaveBeenCalledWith(defaultCollaborator);
    }));
  });

  describe('edit collaborator', () => {
    beforeEach((() => {
      initData();

      TestBed.configureTestingModule({
        declarations: [MatchCollaboratorComponent ],
        imports: [
          ReactiveFormsModule,
          SharedModule,
          BrowserAnimationsModule,
          RouterTestingModule
        ] ,
        providers: [
          { provide: MatDialogRef, useValue: { close: () => {} } },
          { provide: MAT_DIALOG_DATA, useValue: {
             sites: agencies, serviceLines , collaborator : defaultCollaborator
             }  as CollaboratorCreationOrEditionParameters },
          { provide: CollaboratorsService, useValue: {
              edit: () => of(defaultCollaborator)
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(MatchCollaboratorComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    }));
    it('should initially display a form with all the  fields containing the information  of the collaborator being edited', () => {
      expect(component.createCollaboratorForm.get('firstname').value).toBe(defaultCollaborator.firstname);
      expect(component.createCollaboratorForm.get('lastname').value).toBe('doe');
      expect(component.createCollaboratorForm.get('ggid').value).toBe(12321232 );
      expect(component.createCollaboratorForm.get('email').value).toBe('bob.doe@capgemini.com');
      expect(component.createCollaboratorForm.get('agency').value).toEqual(agencies[0]);
      expect(component.createCollaboratorForm.get('serviceLineId').value).toBe( serviceLines[0].id);
    });

    it('when editing collaborator succedeed, should close dialog  ', () => {
      const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
      updateForm('bob', 'doe', 12321232 , 'bDoe@capgemini.com', agencies[0] ,  serviceLines[0]);
      fixture.detectChanges();
      element.querySelector<HTMLButtonElement>('button[type=submit]').click();
      expect(dialogCloseSpy).toHaveBeenCalledWith(defaultCollaborator);
    });
  });

  function updateForm(firstname: string, lastname: string, ggid: number,  email: string, agency: Agency, serviceLineId: ServiceLine) {
    component.createCollaboratorForm.controls.firstname.setValue(firstname);
    component.createCollaboratorForm.controls.lastname.setValue(lastname);
    component.createCollaboratorForm.controls.ggid.setValue(ggid);
    component.createCollaboratorForm.controls.email.setValue(email);
    component.createCollaboratorForm.controls.agency.setValue(agency);
    component.createCollaboratorForm.controls.serviceLineId.setValue(serviceLineId);
  }

  function initData(): void {
    agencies = [{
      id: 1,
      name: 'Biot',
      postalCode: '06410'
    }];

    serviceLines = [{
      id: 1,
      name: 'DIT',
      description: 'Digital Innovation & Technology'
    }];

    defaultCollaborator = {
      id: 1,
      ggid: 12321232,
      firstname: 'bob',
      lastname: 'doe',
      email: 'bob.doe@capgemini.com',
      fullname: 'bob doe',
      agencyId: agencies[0].id,
      agency: agencies[0],
      serviceLineId: serviceLines[0].id,
      serviceLine: serviceLines[0],
      collaboratorSkills: null
    };
  }

});
