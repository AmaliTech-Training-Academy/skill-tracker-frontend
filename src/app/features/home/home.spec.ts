import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHome } from './home';

describe('NewHome', () => {
  let component: NewHome;
  let fixture: ComponentFixture<NewHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHome],
    }).compileComponents();

    fixture = TestBed.createComponent(NewHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
