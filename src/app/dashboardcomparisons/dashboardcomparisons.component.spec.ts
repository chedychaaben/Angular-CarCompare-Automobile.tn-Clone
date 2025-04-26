import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardcomparisonsComponent } from './dashboardcomparisons.component';

describe('DashboardcomparisonsComponent', () => {
  let component: DashboardcomparisonsComponent;
  let fixture: ComponentFixture<DashboardcomparisonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardcomparisonsComponent]
    });
    fixture = TestBed.createComponent(DashboardcomparisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
