import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingComponent, Star } from './star-rating.component';
import { MatIconModule } from '@angular/material';

describe('StarRatingComponent', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarRatingComponent ],
      imports: [ MatIconModule ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

    component.rate = 3;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create by default 5 rate stars as non editable with rate of 3', () => {
    expect(element.querySelectorAll('.star').length).toBe(5);
    expect(element.querySelectorAll('.editable').length).toBe(0);
    expect(element.querySelectorAll('.selected').length).toBe(3);
    expect(element.querySelectorAll('.hover').length).toBe(0);
  });

  it('should display and 1 star and one half of star when rate is 1.5', () => {
    expect(component).toBeTruthy();

    component.rate = 1.5;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(2);
    expect(element.querySelectorAll('.selected')[0].textContent.trim()).toBe('star');
    expect(element.querySelectorAll('.selected')[1].textContent.trim()).toBe('star_half');
  });

  it('should display correctly stars and half of star when rate is 1.3', () => {
    expect(component).toBeTruthy();

    component.rate = 1.3;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(1);
    expect(element.querySelectorAll('.selected')[0].textContent.trim()).toBe('star');
  });

  it('should display correctly stars and half of star when rate is 1.4', () => {
    expect(component).toBeTruthy();

    component.rate = 1.4;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(2);
    expect(element.querySelectorAll('.selected')[0].textContent.trim()).toBe('star');
    expect(element.querySelectorAll('.selected')[1].textContent.trim()).toBe('star_half');
  });

  it('should display correctly stars and half of star when rate is 1.7', () => {
    expect(component).toBeTruthy();

    component.rate = 1.7;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(2);
    expect(element.querySelectorAll('.selected')[0].textContent.trim()).toBe('star');
    expect(element.querySelectorAll('.selected')[1].textContent.trim()).toBe('star_half');
  });

  it('should display correctly stars and half of star when rate is 1.8', () => {
    expect(component).toBeTruthy();

    component.rate = 1.8;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(2);
    expect(element.querySelectorAll('.selected')[0].textContent.trim()).toBe('star');
    expect(element.querySelectorAll('.selected')[1].textContent.trim()).toBe('star');
  });

  it('should select 4 stars when click on star 4', () => {
    component.rate = 3;
    component.isEditable = true;
    component.ngOnInit();
    fixture.detectChanges();

    component.click(new Star(4, 0));
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(4);
  });

  it('should select 2 stars when click on star 2', () => {
    component.rate = 3;
    component.isEditable = true;
    component.ngOnInit();
    fixture.detectChanges();

    component.click(new Star(2, 1));
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(2);
  });

  it('should emit new rate value when star clicked', () => {
    spyOn(component.rateChange, 'emit');

    component.rate = 3;
    component.isEditable = true;
    component.ngOnInit();
    fixture.detectChanges();

    component.click(new Star(5, 0));
    fixture.detectChanges();

    expect(component.rateChange.emit).toHaveBeenCalledWith(5);
  });

  it('should unselect all stars when click on current max star', () => {
    component.rate = 3;
    component.isEditable = true;
    component.ngOnInit();
    fixture.detectChanges();

    component.click(new Star(3, 1));
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(0);
  });

  it('should hover correctly stars', () => {
    component.rate = 1;
    component.isEditable = true;
    component.ngOnInit();
    fixture.detectChanges();

    expect(element.querySelectorAll('.selected').length).toBe(1);

    component.enter(new Star(4, 0));
    fixture.detectChanges();

    expect(element.querySelectorAll('.hover').length).toBe(4);

    component.leave();
    fixture.detectChanges();

    expect(element.querySelectorAll('.hover').length).toBe(0);
    expect(element.querySelectorAll('.selected').length).toBe(1);
  });
});
