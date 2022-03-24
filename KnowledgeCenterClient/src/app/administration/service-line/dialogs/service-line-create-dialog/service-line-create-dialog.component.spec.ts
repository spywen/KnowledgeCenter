import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceLineCreateDialogComponent } from './service-line-create-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceLine } from '../../../../shared/models/ServiceLine';
import { of } from 'rxjs';
import { ServiceLineService } from '../../../../shared/services/service-line.service';

describe('ServiceLineCreateDialogComponent', () => {
  let component: ServiceLineCreateDialogComponent;
  let fixture: ComponentFixture<ServiceLineCreateDialogComponent>;
  let element: HTMLElement;

  const defaultServiceLine = {
    id: 1,
    name: 'DIT',
    description: 'Digital Innovation And Technology'
  } as ServiceLine;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceLineCreateDialogComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: ServiceLineService, useValue: { create: () => of(defaultServiceLine) } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLineCreateDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially display an empty form and the add button should be disabled', () => {
    expect(component.serviceLineForm.get('name').value).toBe('');
    expect(component.serviceLineForm.get('description').value).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no name is provided', () => {
    updateForm('', 'Digital Innovation And Technology');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be disabled when no description is provided', () => {
    updateForm('DIT', '');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).toBeTruthy();
  });

  it('button should be enabled when name and description are defined', () => {
    updateForm('DIT', 'Digital Innovation And Technology');
    fixture.detectChanges();

    expect(element.querySelector<HTMLButtonElement>('button[type=submit]').disabled).not.toBeTruthy();
  });

  it('when adding a service line succedeed, should close dialog', () => {
    const dialogCloseSpy = spyOn(TestBed.get(MatDialogRef), 'close');
    updateForm('DIT', 'Digital Innovation And Technology');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[type=submit]').click();

    expect(dialogCloseSpy).toHaveBeenCalledWith(defaultServiceLine);
  });

  function updateForm(name, description) {
    component.serviceLineForm.controls.name.setValue(name);
    component.serviceLineForm.controls.description.setValue(description);
  }
});
