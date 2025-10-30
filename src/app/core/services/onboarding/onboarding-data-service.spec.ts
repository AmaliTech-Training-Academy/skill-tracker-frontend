import { TestBed } from '@angular/core/testing';

import { OnboardingDataService } from './onboarding-data-service';

describe('OnboardingService', () => {
  let service: OnboardingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
