import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareformComponent } from './compareform.component';

describe('CompareformComponent', () => {
  let component: CompareformComponent;
  let fixture: ComponentFixture<CompareformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompareformComponent]
    });
    fixture = TestBed.createComponent(CompareformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
