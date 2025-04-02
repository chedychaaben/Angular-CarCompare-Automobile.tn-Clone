import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparedetailsComponent } from './comparedetails.component';

describe('ComparedetailsComponent', () => {
  let component: ComparedetailsComponent;
  let fixture: ComponentFixture<ComparedetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComparedetailsComponent]
    });
    fixture = TestBed.createComponent(ComparedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
