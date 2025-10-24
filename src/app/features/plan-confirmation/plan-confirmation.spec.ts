import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanConfirmation } from './plan-confirmation';

describe('PlanConfirmation', () => {
  let component: PlanConfirmation;
  let fixture: ComponentFixture<PlanConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
