import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { ApiService } from '../../services/api/api-service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { TrajectoryGranularity } from '../../models/dashboard.model';
import { HttpContext } from '@angular/common/http';

const mockApiService = {
  get: jest.fn(),
};

describe('DashboardService', () => {
  let service: DashboardService;
  let apiService: ApiService;

  const { API_ENDPOINTS } = APP_CONSTANTS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, { provide: ApiService, useValue: mockApiService }],
    });
    service = TestBed.inject(DashboardService);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDashboardAnalytics', () => {
    it('should call api.get with the correct endpoint', (done) => {
      const mockResponse = { data: { userStats: { totalXp: 100 } } };
      mockApiService.get.mockReturnValue(of(mockResponse));

      service.getDashboardAnalytics().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(apiService.get).toHaveBeenCalledWith(API_ENDPOINTS.DASHBOARD_ANALYTICS);
        done();
      });
    });
  });

  describe('getDashboardRecommendedTasks', () => {
    it('should call api.get with the correct endpoint', (done) => {
      const mockResponse = { data: [] };
      mockApiService.get.mockReturnValue(of(mockResponse));

      service.getDashboardRecommendedTasks().subscribe((response) => {
        expect(response).toEqual(mockResponse);

        expect(apiService.get).toHaveBeenCalledWith(
          API_ENDPOINTS.DASHBOARD_RECOMMENDED_TASKS,
          expect.objectContaining({
            context: expect.any(HttpContext),
          }),
        );
        done();
      });
    });
  });

  describe('getDashboardTrajectory', () => {
    it('should call api.get with the correct URL and options', (done) => {
      const skillId = 'skill123';
      const granularity = TrajectoryGranularity.WEEKLY;
      const mockResponse = { data: [] };
      const expectedUrl = API_ENDPOINTS.DASHBOARD_TRAJECTORY.replace('{skillId}', skillId);
      const expectedOptions = { params: { granularity } };

      mockApiService.get.mockReturnValue(of(mockResponse));

      service.getDashboardTrajectory(skillId, granularity).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(apiService.get).toHaveBeenCalledWith(expectedUrl, expectedOptions);
        done();
      });
    });
  });
});
