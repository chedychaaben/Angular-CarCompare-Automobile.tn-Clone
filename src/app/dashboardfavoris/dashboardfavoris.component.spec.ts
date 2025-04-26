import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardfavorisComponent } from './dashboardfavoris.component';

describe('DashboardfavorisComponent', () => {
  let component: DashboardfavorisComponent;
  let fixture: ComponentFixture<DashboardfavorisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardfavorisComponent]
    });
    fixture = TestBed.createComponent(DashboardfavorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
