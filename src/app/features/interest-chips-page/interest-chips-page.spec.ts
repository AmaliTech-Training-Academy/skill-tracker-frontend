import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestChipsPage } from './interest-chips-page';

describe('InterestChipsPage', () => {
  let component: InterestChipsPage;
  let fixture: ComponentFixture<InterestChipsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestChipsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestChipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
