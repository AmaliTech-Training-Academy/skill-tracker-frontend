import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutputConsole } from './output-console';

describe('OutputConsole', () => {
  let component: OutputConsole;
  let fixture: ComponentFixture<OutputConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputConsole],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputConsole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit runCode when onRunCode is called', () => {
    component.runCode.emit = jest.fn();
    component.onRunCode();
    expect(component.runCode.emit).toHaveBeenCalled();
  });

  it('should emit submitTask when onSubmitTask is called', () => {
    component.submitTask.emit = jest.fn();
    component.onSubmitTask();
    expect(component.submitTask.emit).toHaveBeenCalled();
  });

  it('should set active tab to console', () => {
    component.setActiveTab('console');
    expect(component.activeTab()).toBe('console');
  });

  it('should set active tab to tests', () => {
    component.setActiveTab('tests');
    expect(component.activeTab()).toBe('tests');
  });

  it('should have default active tab as console', () => {
    expect(component.activeTab()).toBe('console');
  });
});
