import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanLevels } from './plan-levels';

describe('PlanLevels', () => {
  let component: PlanLevels;
  let fixture: ComponentFixture<PlanLevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanLevels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanLevels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
