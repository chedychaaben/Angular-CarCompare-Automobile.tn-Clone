import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueformComponent } from './marqueform.component';

describe('MarqueformComponent', () => {
  let component: MarqueformComponent;
  let fixture: ComponentFixture<MarqueformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarqueformComponent]
    });
    fixture = TestBed.createComponent(MarqueformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
