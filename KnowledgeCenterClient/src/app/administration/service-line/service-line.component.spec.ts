import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceLineComponent } from './service-line.component';
import { ServiceLine } from '../../shared/models/ServiceLine';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ServiceLineService } from '../../shared/services/service-line.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ServiceLineCreateDialogComponent } from './dialogs/service-line-create-dialog/service-line-create-dialog.component';
import { ServiceLineEditDialogComponent } from './dialogs/service-line-edit-dialog/service-line-edit-dialog.component';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';

describe('ServiceLineComponent', () => {
  let component: ServiceLineComponent;
  let fixture: ComponentFixture<ServiceLineComponent>;
  let element: HTMLElement;

  let serviceLines: ServiceLine[];

  beforeEach((() => {

    initData();

    TestBed.configureTestingModule({
      declarations: [ ServiceLineComponent, ServiceLineCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ServiceLineService, useValue: { delete: () => of() } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({id: null})), data: of({
          serviceLines: [...serviceLines]
        }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceLineComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty search field and a table with 2 rows', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0]).toEqual({id: 1, name: 'DIT', description: 'Digital Innovation And Technology'});
    expect(component.dataSource.data[1]).toEqual({id: 2, name: 'Move To Cloud', description: 'Move To Cloud'});
  });

  it('should only display one row in the table when "di" is typed inside the search field', () => {
    enterFilterKeyword('di');

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0]).toEqual({id: 1, name: 'DIT', description: 'Digital Innovation And Technology'});
  });

  describe('add service line', () => {
    it('should open the add serviceline dialog when the plus icon is clicked', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      element.querySelector<HTMLButtonElement>('button.bottom-right-fixed-button').click();

      expect(openDialogSpy).toHaveBeenCalledWith(ServiceLineCreateDialogComponent, {
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

    it('should refresh datasource and reset form when service line created', () => {
      const newAgency = { id: 3, name: 'DTC', description: 'Digital Technology And Cloud'} as ServiceLine;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(newAgency)};
      openDialogSpy.and.returnValue(dialogRefMock);
      const filterInput = element.querySelector<HTMLInputElement>('input[name=filter]');
      filterInput.value = 'di';

      component.add();

      expect(component.dataSource.data.length).toBe(3);
      expect(component.dataSource.data[0]).toBe(newAgency);
      expect(filterInput.value).toBe('');
    });
  });

  describe('edit service line', () => {
    it('should open the edit serviceline dialog when user click on edit button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(serviceLines[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(ServiceLineEditDialogComponent, {
        width: '500px',
        data: serviceLines[0]
      });
    });

    it('should not refresh datasource when nothing edited', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(serviceLines[0]);

      expect(component.dataSource.data[0].name).toBe(serviceLines[0].name);
      expect(component.dataSource.data[0].description).toBe(serviceLines[0].description);
    });

    it('should refresh datasource when agency updated', () => {
      const editedServiceLine = {
        ...serviceLines[0],
        name: 'XYZ',
        description: 'x y z'
      } as ServiceLine;
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(editedServiceLine)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.edit(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data[0].id).toBe(editedServiceLine.id);
      expect(component.dataSource.data[0].name).toBe(editedServiceLine.name);
      expect(component.dataSource.data[0].description).toBe(editedServiceLine.description);
    });
  });

  describe('delete service line', () => {
    it('should open the delete dialog when user click on delete button', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(serviceLines[0]);

      expect(openDialogSpy).toHaveBeenCalledWith(DeleteDialogComponent, jasmine.objectContaining({
        width: '500px',
        data: jasmine.objectContaining({
          elementId: serviceLines[0].id,
          name: serviceLines[0].name,
          type: 'service line'
        })
      }));
    });

    it('should not refresh datasource when nothing deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(false)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(serviceLines[0]);

      expect(component.dataSource.data.length).toBe(2);
    });

    it('should refresh datasource when agency deleted', () => {
      const openDialogSpy = spyOn(TestBed.get(MatDialog), 'open');
      const dialogRefMock = { afterClosed: () => of(true)};
      openDialogSpy.and.returnValue(dialogRefMock);

      component.delete(component.dataSource.data[0]);

      expect(component.dataSource.data.length).toBe(1);
      expect(component.dataSource.data.findIndex(x => x.name === 'DIT')).toBe(-1);
    });
  });

  function enterFilterKeyword(keyword: string) {
    const filterInput = fixture.debugElement.query(By.css('input[name=filter]')).nativeElement;
    filterInput.value = keyword;
    const event = new KeyboardEvent('keyup', {});
    filterInput.dispatchEvent(event);
  }

  function initData(): void {
    serviceLines = [
      {
        id: 1,
        name: 'DIT',
        description: 'Digital Innovation And Technology'
      },
      {
        id: 2,
        name: 'Move To Cloud',
        description: 'Move To Cloud'
      }
    ];
  }
});
