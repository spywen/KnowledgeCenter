import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgencyComponent } from './agency.component';
import { Agency} from '../../shared/models/Agency';
import { ReactiveFormsModule} from '@angular/forms';
import { SharedModule} from '../../shared/shared.module';
import { ActivatedRoute, convertToParamMap} from '@angular/router';
import { of } from 'rxjs';
import { AgencyService} from '../../shared/services/agency.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgencyCreateDialogComponent } from './dialogs/agency-create-dialog/agency-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { AgencyEditDialogComponent } from './dialogs/agency-edit-dialog/agency-edit-dialog.component';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';

describe('AgencyComponent', () => {
  let component: AgencyComponent;
  let fixture: ComponentFixture<AgencyComponent>;
  let element: HTMLElement;

  let agencies: Agency[];

  beforeEach((() => {

    initData();

    TestBed.configureTestingModule({
      declarations: [ AgencyComponent, AgencyCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AgencyService, useValue: { delete: () => of() } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({id: null})), data: of({agencies}) } },
        { provide: MatDialog, useValue: { open: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgencyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty search field and a table with 2 rows', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual({id: 1, name: 'Bayonne', postalCode: '64100'});
    expect(component.dataSource.data[1]).toEqual({id: 2, name: 'Lille', postalCode: '60404'});
  });

  it('should only display one row in the table when "ba" is entered inside the search field', () => {
    enterFilterKeyword('ba');

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0]).toEqual({id: 1, name: 'Bayonne', postalCode: '64100'});
  });

  describe('add agency', () => {
    it('should open the add agency dialog when the plus icon is clicked', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('button.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(AgencyCreateDialogComponent, {
        width: '500px'
      });
    });

    it('should not refresh datasource and reset form when nothing created', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterFormResetSpy = spyOn(component.filterForm, 'reset');

      component.add();

      expect(component.dataSource.data.length).toBe(2);
      expect(filterFormResetSpy).not.toHaveBeenCalled();
    });

    it('should refresh datasource and reset form when agency created', () => {
      const newAgency = { id: 3, name: 'Biot', postalCode: '06410'} as Agency;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(newAgency)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterInput = element.querySelector<HTMLInputElement>('input[name=filter]');
      filterInput.value = 'ba';

      component.add();

      expect(component.dataSource.data.length).toBe(3);
      expect(component.dataSource.data[0]).toBe(newAgency);
      expect(filterInput.value).toBe('');
    });
  });

  describe('edit agency', () => {
    it('should open the edit agency dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(agencies[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(AgencyEditDialogComponent, {
        width: '500px',
        data: agencies[0]
      });
    });

    it('should not refresh datasource when nothing edited', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(agencies[0]);

      expect(component.dataSource.data[0].name).toBe(agencies[0].name);
      expect(component.dataSource.data[0].postalCode).toBe(agencies[0].postalCode);
    });

    it('should refresh datasource when agency updated', () => {
      const editedAgency = {
        ...agencies[0]
      } as Agency;
      editedAgency.name = 'Saint Tropez';
      editedAgency.postalCode = '83990';
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedAgency)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].id).toBe(editedAgency.id);
      expect(component.dataSource.data[0].name).toBe(editedAgency.name);
      expect(component.dataSource.data[0].postalCode).toBe(editedAgency.postalCode);
    });
  });

  describe('delete agency', () => {
    it('should open the delete dialog when user click on delete button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(agencies[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: agencies[0].id,
          name: agencies[0].name,
          type: 'agency'
        })
      }));
    });

    it('should not refresh datasource when nothing deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(agencies[0]);

      expect(component.dataSource.data.length).toBe(2);
    });

    it('should refresh datasource when agency deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.findIndex(x => x.name === 'Bayonne')).toBe(-1);
    });
  });

  function enterFilterKeyword(keyword: string) {
    const filterInput = fixture.debugElement.query(By.css('input[name=filter]')).nativeElement;
    filterInput.value = keyword;
    const event = new KeyboardEvent('keyup', {});
    filterInput.dispatchEvent(event);
  }

  function initData(): void {
    agencies = [
      {
        id: 1,
        name: 'Bayonne',
        postalCode: '64100'
      },
      {
        id: 2,
        name: 'Lille',
        postalCode: '60404'
      }
    ];
  }
});
