import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skillarena } from './skillarena';

describe('Skillarena', () => {
  let component: Skillarena;
  let fixture: ComponentFixture<Skillarena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skillarena],
    }).compileComponents();

    fixture = TestBed.createComponent(Skillarena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
