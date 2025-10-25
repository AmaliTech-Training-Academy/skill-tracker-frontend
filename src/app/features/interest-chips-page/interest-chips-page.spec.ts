import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestsPageComponent } from './interest-chips-page';

describe('InterestChipsPage', () => {
  let component: InterestsPageComponent;
  let fixture: ComponentFixture<InterestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
