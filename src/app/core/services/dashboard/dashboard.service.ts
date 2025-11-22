import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DashboardResponse,
  RecommendedTasksResponse,
  TrajectoryGranularity,
  SkillTrajectoryResponse,
  UserSelectedSkill,
} from '../../models/dashboard.model';
import { APP_CONSTANTS, SKIP_ERROR_NOTIFICATION } from '../../constants/app.constants';
import { ApiService } from '../../services/api/api-service';
import { HttpContext, HttpParams } from '@angular/common/http';

const { API_ENDPOINTS } = APP_CONSTANTS;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private api: ApiService) {}

  public getDashboardAnalytics(): Observable<DashboardResponse> {
    return this.api.get<DashboardResponse>(API_ENDPOINTS.DASHBOARD_ANALYTICS);
  }

  public getDashboardRecommendedTasks(skillName?: string): Observable<RecommendedTasksResponse> {
    let params = new HttpParams();

    if (skillName) {
      params = params.set('skillName', skillName);
    }

    return this.api.get<RecommendedTasksResponse>(API_ENDPOINTS.DASHBOARD_RECOMMENDED_TASKS, {
      params,
      context: new HttpContext().set(SKIP_ERROR_NOTIFICATION, true),
    });
  }

  public getDashboardTrajectory(
    skillId: string,
    granularity: TrajectoryGranularity,
  ): Observable<SkillTrajectoryResponse> {
    const url = API_ENDPOINTS.DASHBOARD_TRAJECTORY.replace('{skillId}', skillId);
    const options = { params: { granularity } };
    return this.api.get<SkillTrajectoryResponse>(url, options);
  }

  public getUserSkills(): Observable<UserSelectedSkill[]> {
    return this.api.get<UserSelectedSkill[]>(API_ENDPOINTS.USER_SKILLS);
  }
}
