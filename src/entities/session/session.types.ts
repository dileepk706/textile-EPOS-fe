import { User } from 'entities/user/user.entity';

export type { User };

export type Member = User;

export type SessionState = {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  sessionExpired: boolean;
};
