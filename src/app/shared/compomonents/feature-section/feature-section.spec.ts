import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeatureSection } from './feature-section';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [FeatureSection],
  template: `
    <app-feature-section
      [title]="hostTitle"
      [subtitle]="hostSubtitle"
      [items]="hostItems"
      [type]="hostType"
    />
  `,
})
class TestHostComponent {
  hostTitle = 'Initial Title';
  hostSubtitle = 'Initial Subtitle';
  hostItems: Feature[] = [{ icon: 'rocket', title: 'Feature 1', description: 'Description 1' }];
  hostType: 'default' | 'skill-development' = 'default';
}

describe('FeatureSection', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let componentDebugElement: DebugElement;
  let componentInstance: FeatureSection;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureSection, TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    componentDebugElement = hostFixture.debugElement.query(
      By.directive(FeatureSection),
    ) as DebugElement;
    componentInstance = componentDebugElement.componentInstance as FeatureSection;
    hostFixture.detectChanges();
  });

  it('should create the component', () => {
    expect(componentInstance).toBeTruthy();
  });

  it('should receive and reflect the required title input', () => {
    expect(componentInstance.title()).toBe(hostFixture.componentInstance.hostTitle);

    hostFixture.componentInstance.hostTitle = 'Updated Title';
    hostFixture.detectChanges();
    expect(componentInstance.title()).toBe('Updated Title');
  });

  it('should receive and reflect the required subtitle input', () => {
    expect(componentInstance.subtitle()).toBe(hostFixture.componentInstance.hostSubtitle);

    hostFixture.componentInstance.hostSubtitle = 'Updated Subtitle';
    hostFixture.detectChanges();
    expect(componentInstance.subtitle()).toBe('Updated Subtitle');
  });

  it('should receive and reflect the required items input', () => {
    expect(componentInstance.items().length).toBe(1);
    expect(componentInstance.items()).toEqual(hostFixture.componentInstance.hostItems);

    hostFixture.componentInstance.hostItems = [
      { icon: 'star', title: 'New F', description: 'New D' },
      { icon: 'star', title: 'New F2', description: 'New D2' },
    ];
    hostFixture.detectChanges();
    expect(componentInstance.items().length).toBe(2);
  });

  it('should receive and reflect the type input when set to skill-development', () => {
    hostFixture.componentInstance.hostType = 'skill-development';
    hostFixture.detectChanges();
    expect(componentInstance.type()).toBe('skill-development');
  });

  it('should use the default type when type input is explicitly bound to default', () => {
    hostFixture.componentInstance.hostType = 'default';
    hostFixture.detectChanges();
    expect(componentInstance.type()).toBe('default');
  });

  it('should default to type "default" when type input is not bound', () => {
    @Component({
      selector: 'app-default-host',
      standalone: true,
      imports: [FeatureSection],
      template: ` <app-feature-section [title]="'T'" [subtitle]="'S'" [items]="hostItems" /> `,
    })
    class DefaultHostComponent {
      hostItems: Feature[] = [];
    }

    const defaultHostFixture = TestBed.createComponent(DefaultHostComponent);
    defaultHostFixture.detectChanges();
    const defaultComponentInstance = defaultHostFixture.debugElement.query(
      By.directive(FeatureSection),
    ).componentInstance as FeatureSection;

    expect(defaultComponentInstance.type()).toBe('default');
  });
});
