import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosserieEditModalComponent } from './carrosserie-edit-modal.component';

describe('CarrosserieEditModalComponent', () => {
  let component: CarrosserieEditModalComponent;
  let fixture: ComponentFixture<CarrosserieEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrosserieEditModalComponent]
    });
    fixture = TestBed.createComponent(CarrosserieEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
