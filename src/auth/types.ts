import { LoginUserDto, RegisterUserDto } from 'shared/api/api.types';

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  user: AuthUserType;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (loginUserDto: LoginUserDto) => Promise<any>;
  register: (registerUserDto: RegisterUserDto) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  currentGym: any;
  permissions: any[];
  features: any[];
  setSession: (session: { accessToken: string; user: any }) => void;
};
