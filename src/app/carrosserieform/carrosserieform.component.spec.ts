import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosserieformComponent } from './carrosserieform.component';

describe('CarrosserieformComponent', () => {
  let component: CarrosserieformComponent;
  let fixture: ComponentFixture<CarrosserieformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrosserieformComponent]
    });
    fixture = TestBed.createComponent(CarrosserieformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
