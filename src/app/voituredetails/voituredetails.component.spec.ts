import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoituredetailsComponent } from './voituredetails.component';

describe('VoituredetailsComponent', () => {
  let component: VoituredetailsComponent;
  let fixture: ComponentFixture<VoituredetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoituredetailsComponent]
    });
    fixture = TestBed.createComponent(VoituredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
