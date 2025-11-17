import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '@app/core';
import { ApiService } from '@app/core';
import { Observable } from 'rxjs';
import { SkillsResponse } from '../models/skill.model';

const { API_ENDPOINTS } = APP_CONSTANTS;

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  constructor(private api: ApiService) {}

  public getSkills(): Observable<SkillsResponse> {
    return this.api.get<SkillsResponse>(API_ENDPOINTS.SKILLS);
  }
}
