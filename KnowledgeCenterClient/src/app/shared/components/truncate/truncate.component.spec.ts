import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruncateComponent } from './truncate.component';
import { MatTooltipModule } from '@angular/material';
import { TruncatePipe } from '../../pipes/truncate.pipe';

describe('TruncateComponent', () => {
  let component: TruncateComponent;
  let fixture: ComponentFixture<TruncateComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruncateComponent, TruncatePipe ],
      imports: [ MatTooltipModule ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruncateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();

    component.text = '0123456789';
    component.maxSize = 5;
    component.displayTooltip = true;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should truncate text when exceed max size allowed', () => {
    expect(element.querySelector('span').textContent.trim()).toBe('01234...');
  });

  it('should display entire text when is below max size limit', () => {
    component.maxSize = 20;
    fixture.detectChanges();

    expect(element.querySelector('span').textContent.trim()).toBe('0123456789');
  });
});
