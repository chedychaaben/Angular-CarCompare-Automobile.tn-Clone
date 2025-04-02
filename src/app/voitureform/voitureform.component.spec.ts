import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoitureformComponent } from './voitureform.component';

describe('VoitureformComponent', () => {
  let component: VoitureformComponent;
  let fixture: ComponentFixture<VoitureformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoitureformComponent]
    });
    fixture = TestBed.createComponent(VoitureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
