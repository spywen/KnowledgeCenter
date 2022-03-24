import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ShareButtonComponent } from './share-button.component';
import { MatIconModule } from '@angular/material';
import { TooltipService } from '../../services/tooltip.service';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let fixture: ComponentFixture<ShareButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareButtonComponent ],
      imports: [ MatIconModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: TooltipService, useValue: { info: () => {} } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.relativePath = '/projects/public/12';
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
