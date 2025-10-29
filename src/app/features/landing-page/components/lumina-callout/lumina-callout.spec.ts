import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuminaCallout } from './lumina-callout';

describe('LuminaCallout', () => {
  let component: LuminaCallout;
  let fixture: ComponentFixture<LuminaCallout>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuminaCallout],
    }).compileComponents();

    fixture = TestBed.createComponent(LuminaCallout);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    expect(component.title).toBe('Meet Lumina: The AI that illuminates your technical path.');
  });

  it('should have default button text', () => {
    expect(component.buttonText).toBe('Meet Lumina');
  });

  it('should render title in template', () => {
    expect(compiled.querySelector('.callout-title')?.textContent).toContain(component.title);
  });

  it('should render button with correct text', () => {
    expect(compiled.querySelector('.callout-button')?.textContent?.trim()).toBe(
      component.buttonText,
    );
  });

  it('should render robot image with correct attributes', () => {
    const img = compiled.querySelector('.robot-image') as HTMLImageElement;
    expect(img.src).toContain('assets/robot.png');
    expect(img.alt).toBe('Lumina AI Robot');
  });
});
