import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomDropdown } from './custom-dropdown';

describe('CustomDropdown', () => {
  let component: CustomDropdown;
  let fixture: ComponentFixture<CustomDropdown>;

  const mockOptions = ['All', 'HTML', 'CSS', 'JavaScript'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('selectedValue', 'All');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selected value', () => {
    const selectedValue = fixture.nativeElement.querySelector('.selected-value');

    expect(selectedValue.textContent).toBe('All');
  });

  it('should toggle dropdown when trigger is clicked', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown-trigger');

    expect(component.isOpen()).toBeFalsy();

    trigger.click();

    expect(component.isOpen()).toBeTruthy();
  });

  it('should show options when dropdown is open', () => {
    component.toggleDropdown();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.dropdown-option');

    expect(options.length).toBe(4);
    expect(options[0].textContent.trim()).toBe('All');
    expect(options[1].textContent.trim()).toBe('HTML');
  });

  it('should emit selectionChange when option is selected', () => {
    jest.spyOn(component.selectionChange, 'emit');

    component.selectOption('JavaScript');

    expect(component.selectionChange.emit).toHaveBeenCalledWith('JavaScript');
    expect(component.isOpen()).toBeFalsy();
  });

  it('should close dropdown when closeDropdown is called', () => {
    component.toggleDropdown();
    expect(component.isOpen()).toBeTruthy();

    component.closeDropdown();

    expect(component.isOpen()).toBeFalsy();
  });

  it('should handle keyboard events on trigger', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown-trigger');

    expect(component.isOpen()).toBeFalsy();

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger.dispatchEvent(enterEvent);

    expect(component.isOpen()).toBeTruthy();
  });

  it('should handle keyboard events on options', () => {
    jest.spyOn(component.selectionChange, 'emit');
    component.toggleDropdown();
    fixture.detectChanges();

    const option = fixture.nativeElement.querySelector('.dropdown-option');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    option.dispatchEvent(enterEvent);

    expect(component.selectionChange.emit).toHaveBeenCalledWith('All');
  });

  it('should show fallback value when selectedValue is undefined', () => {
    fixture.componentRef.setInput('selectedValue', undefined);
    fixture.detectChanges();

    const selectedValue = fixture.nativeElement.querySelector('.selected-value');

    expect(selectedValue.textContent).toBe('All');
  });
});
