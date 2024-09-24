import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeGraphsComponent } from './time-graphs.component';

describe('TimeGraphsComponent', () => {
  let component: TimeGraphsComponent;
  let fixture: ComponentFixture<TimeGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeGraphsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
