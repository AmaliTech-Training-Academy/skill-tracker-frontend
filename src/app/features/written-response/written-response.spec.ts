import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrittenResponse } from './written-response';

describe('WrittenResponse', () => {
  let component: WrittenResponse;
  let fixture: ComponentFixture<WrittenResponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrittenResponse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrittenResponse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
