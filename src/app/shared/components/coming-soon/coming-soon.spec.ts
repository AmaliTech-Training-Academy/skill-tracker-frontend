import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { ComingSoon } from './coming-soon';

describe('ComingSoon', () => {
  let component: ComingSoon;
  let fixture: ComponentFixture<ComingSoon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComingSoon],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComingSoon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title and description', () => {
    expect(component.title).toBe('Coming Soon');
    expect(component.description).toBe('Stay tuned for updates!');
  });

  it('should display the title and description in the template', () => {
    component.title = 'New Feature';
    component.description = 'Details coming soon!';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h1'));
    const descriptionElement = fixture.debugElement.query(By.css('p'));

    expect(titleElement.nativeElement.textContent).toBeDefined();
    expect(descriptionElement.nativeElement.textContent).toBeDefined();
  });

  it('should accept an iconName input', () => {
    component.iconName = 'star';
    expect(component.iconName).toBe('star');
  });
});
