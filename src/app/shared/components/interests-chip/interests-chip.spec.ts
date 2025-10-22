import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestsChip } from './interests-chip';

describe('InterestsChip', () => {
  let component: InterestsChip;
  let fixture: ComponentFixture<InterestsChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsChip],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestsChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
