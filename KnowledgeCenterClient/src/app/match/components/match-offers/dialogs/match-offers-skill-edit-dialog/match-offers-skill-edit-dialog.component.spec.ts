import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOffersSkillEditDialogComponent } from './match-offers-skill-edit-dialog.component';

describe('MatchOffersSkillEditDialogComponent', () => {
  let component: MatchOffersSkillEditDialogComponent;
  let fixture: ComponentFixture<MatchOffersSkillEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchOffersSkillEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchOffersSkillEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
