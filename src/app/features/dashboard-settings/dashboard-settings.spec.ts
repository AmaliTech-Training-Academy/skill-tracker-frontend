import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSettings } from './dashboard-settings';
import { FormBuilder } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectIsUpdatingProfile,
  selectUpdateProfileError,
} from '@app/store/auth/auth.selectors';

describe('DashboardSettings', () => {
  let component: DashboardSettings;
  let fixture: ComponentFixture<DashboardSettings>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSettings],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            { selector: selectCurrentUser, value: null },
            { selector: selectIsUpdatingProfile, value: false },
            { selector: selectUpdateProfileError, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSettings);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch updateProfile when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.form.setValue({
      fullName: 'John Doe',
      email: '',
      bio: 'Developer',
      emailNotifications: true,
      pushNotifications: false,
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalled();
  });
});
