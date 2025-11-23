import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SkillArena } from './skill-arena';
import { ComingSoon } from '@app/shared/components/coming-soon/coming-soon';

describe('SkillArena', () => {
  let component: SkillArena;
  let fixture: ComponentFixture<SkillArena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillArena, ComingSoon],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillArena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
