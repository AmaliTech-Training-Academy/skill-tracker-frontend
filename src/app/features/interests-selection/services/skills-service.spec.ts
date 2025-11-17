import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService, APP_CONSTANTS } from '@app/core';
import { SkillsService } from './skills-service';
import { SkillsResponse } from '../models/skill.model';

describe('SkillsService', () => {
  let service: SkillsService;
  let apiService: ApiService;

  const mockSkillsResponse: SkillsResponse = {
    success: true,
    message: 'Skills retrieved successfully',
    data: [
      {
        id: '1',
        name: 'Angular',
        category: 'frontend',
        description: '',
        iconUrl: '',
        supportedTaskTypes: [],
        levelXpMap: new Map(),
      },
      {
        id: '2',
        name: 'React',
        category: 'frontend',
        description: '',
        iconUrl: '',
        supportedTaskTypes: [],
        levelXpMap: new Map(),
      },
    ],
  };

  const apiServiceMock = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillsService, { provide: ApiService, useValue: apiServiceMock }],
    });
    service = TestBed.inject(SkillsService);
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api.get with the correct endpoint and return skills', () => {
    (apiService.get as jest.Mock).mockReturnValue(of(mockSkillsResponse));
    service.getSkills().subscribe((response) => {
      expect(response).toEqual(mockSkillsResponse);
    });
    expect(apiService.get).toHaveBeenCalledWith(APP_CONSTANTS.API_ENDPOINTS.SKILLS);
  });
});
