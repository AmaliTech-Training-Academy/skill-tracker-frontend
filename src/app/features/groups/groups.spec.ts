import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Groups } from './groups';
import { ComingSoon } from '@app/shared/components/coming-soon/coming-soon';

describe('Groups Component', () => {
  let component: Groups;
  let fixture: ComponentFixture<Groups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Groups, ComingSoon],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Groups);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
