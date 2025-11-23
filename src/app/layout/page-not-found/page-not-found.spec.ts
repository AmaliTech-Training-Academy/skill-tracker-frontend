import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  let component: PageNotFound;
  let fixture: ComponentFixture<PageNotFound>;
  let mockLocation: { back: jest.Mock };

  beforeEach(async () => {
    mockLocation = { back: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PageNotFound, RouterTestingModule],
      providers: [{ provide: Location, useValue: mockLocation }],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should call location.back the expected number of times', () => {
    component.goBack();
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalledTimes(2);
  });

  it('should render router links in the template', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).toBeGreaterThan(0);
  });

  it('should call location.back when the primary back button is clicked', () => {
    const backButton = fixture.debugElement.query(By.css('button'));
    expect(backButton).toBeTruthy();
    backButton.triggerEventHandler('click', null);
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
