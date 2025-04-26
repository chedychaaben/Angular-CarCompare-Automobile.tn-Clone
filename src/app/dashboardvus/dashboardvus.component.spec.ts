import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardvusComponent } from './dashboardvus.component';

describe('DashboardvusComponent', () => {
  let component: DashboardvusComponent;
  let fixture: ComponentFixture<DashboardvusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardvusComponent]
    });
    fixture = TestBed.createComponent(DashboardvusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
