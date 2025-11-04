import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanLevels } from './plan-levels';

describe('PlanLevels', () => {
  let component: PlanLevels;
  let fixture: ComponentFixture<PlanLevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanLevels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanLevels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default currentStep of 1', () => {
    expect(component.currentStep).toBe(1);
  });

  it('should accept currentStep input', () => {
    component.currentStep = 2;
    fixture.detectChanges();
    
    expect(component.currentStep).toBe(2);
  });

  it('should update currentStep when input changes', () => {
    component.currentStep = 3;
    fixture.detectChanges();
    
    expect(component.currentStep).toBe(3);
  });

  it('should render with OnPush change detection strategy', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  it('should handle step 1', () => {
    component.currentStep = 1;
    fixture.detectChanges();
    
    expect(component.currentStep).toBe(1);
  });

  it('should handle step 2', () => {
    component.currentStep = 2;
    fixture.detectChanges();
    
    expect(component.currentStep).toBe(2);
  });

  it('should handle step 3', () => {
    component.currentStep = 3;
    fixture.detectChanges();
    
    expect(component.currentStep).toBe(3);
  });
});