import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { UserProfile } from './user-profile';
import { Store } from '@ngrx/store';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons } from '@app/core';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  const mockStore = {
    selectSignal: () => () => null,
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        { provide: Store, useValue: mockStore },
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});
