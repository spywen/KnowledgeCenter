import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyStayHomeComponent } from './why-stay-home.component';

describe('WhyStayHomeComponent', () => {
  let component: WhyStayHomeComponent;
  let fixture: ComponentFixture<WhyStayHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyStayHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyStayHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
