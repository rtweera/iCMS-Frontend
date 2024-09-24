import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpTimeGraphComponent } from './pop-up-time-graph.component';

describe('PopUpTimeGraphComponent', () => {
  let component: PopUpTimeGraphComponent;
  let fixture: ComponentFixture<PopUpTimeGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpTimeGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpTimeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
