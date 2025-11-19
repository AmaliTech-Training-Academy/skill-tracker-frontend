import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureCard } from './feature-card';

describe('FeatureCard', () => {
  let component: FeatureCard;
  let fixture: ComponentFixture<FeatureCard>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureCard);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.componentRef.setInput('icon', 'test-icon.png');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render title, description and icon', () => {
    fixture.componentRef.setInput('title', 'Test Feature');
    fixture.componentRef.setInput('description', 'Test feature description');
    fixture.componentRef.setInput('icon', 'assets/test.png');
    fixture.detectChanges();

    expect(compiled.querySelector('.card-title')?.textContent).toContain('Test Feature');
    expect(compiled.querySelector('.card-description')?.textContent).toContain(
      'Test feature description',
    );

    const img = compiled.querySelector('.card-icon') as HTMLImageElement;
    expect(img.src).toContain('assets/test.png');
    expect(img.alt).toBe('Test Feature');
  });
});
