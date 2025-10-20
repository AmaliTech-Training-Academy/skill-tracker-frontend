import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSelection } from './level-selection';

describe('LevelSelection', () => {
  let component: LevelSelection;
  let fixture: ComponentFixture<LevelSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
