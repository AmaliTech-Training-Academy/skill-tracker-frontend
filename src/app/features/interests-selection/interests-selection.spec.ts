import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestsSelection } from './interests-selection';

describe('InterestsSelection', () => {
  let component: InterestsSelection;
  let fixture: ComponentFixture<InterestsSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestsSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
