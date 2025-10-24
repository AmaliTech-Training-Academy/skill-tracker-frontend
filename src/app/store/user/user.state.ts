export interface UserProfile {
  id: string;
  avatar?: string;
  name?: string;
}

export interface UserState {
  profile: UserProfile | null;
}

export const initialUserState: UserState = {
  profile: null,
};
