import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Planconfirmation } from './planconfirmation';

describe('Planconfirmation', () => {
  let component: Planconfirmation;
  let fixture: ComponentFixture<Planconfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planconfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Planconfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
