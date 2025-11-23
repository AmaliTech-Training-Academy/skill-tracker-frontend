import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/app.state';
import { checkAuthSession } from '@app/store/auth/auth.actions';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { DatePipe } from '@angular/common';
import { AppIcon } from '@app/shared/components/app-icon/app-icon';
import { loadDashboardAnalytics, loadUserSkills } from '@app/store/dashboard/dashboard.actions';

import {
  selectUserStats,
  selectGlobalRank,
  selectUserSkills,
} from '@app/store/dashboard/dashboard.selectors';
import { StatCard } from '@app/shared';

@Component({
  selector: 'app-user-profile',
  imports: [DatePipe, AppIcon, StatCard],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit {
  public user = this.store.selectSignal(selectCurrentUser);
  public userStats = this.store.selectSignal(selectUserStats);
  public globalRank = this.store.selectSignal(selectGlobalRank);
  public userSkills = this.store.selectSignal(selectUserSkills);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(checkAuthSession());
    this.store.dispatch(loadDashboardAnalytics());
    this.store.dispatch(loadUserSkills());
  }
}
