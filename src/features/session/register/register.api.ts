import { registerUser } from 'shared/api/api.services';
import { TRegisterUser } from './register.contracts';

export function registerRequest(registerUserData: TRegisterUser) {
  return registerUser(registerUserData);
}
