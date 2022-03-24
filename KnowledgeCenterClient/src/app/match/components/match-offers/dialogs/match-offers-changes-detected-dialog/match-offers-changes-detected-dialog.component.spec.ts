import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOffersChangesDetectedDialogComponent } from './match-offers-changes-detected-dialog.component';

describe('MatchOffersChangesDetectedDialogComponent', () => {
  let component: MatchOffersChangesDetectedDialogComponent;
  let fixture: ComponentFixture<MatchOffersChangesDetectedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchOffersChangesDetectedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchOffersChangesDetectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
