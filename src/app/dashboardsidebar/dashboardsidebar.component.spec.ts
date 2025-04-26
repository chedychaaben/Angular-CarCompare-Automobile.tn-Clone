import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsidebarComponent } from './dashboardsidebar.component';

describe('DashboardsidebarComponent', () => {
  let component: DashboardsidebarComponent;
  let fixture: ComponentFixture<DashboardsidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardsidebarComponent]
    });
    fixture = TestBed.createComponent(DashboardsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
