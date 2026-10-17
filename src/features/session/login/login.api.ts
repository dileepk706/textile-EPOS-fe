import { loginUser } from 'shared/api/api.services';
import { LoginUser } from './login.contracts';

export function loginRequest(loginUserData: LoginUser) {
  return loginUser(loginUserData);
}
