import {Agency} from './Agency';
import {ServiceLine} from './ServiceLine';

export interface User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  newPassword: string;
  oldPassword: string;
  isActive: boolean;
  passwordTryCount: number;
  fullname: string;
  agency: Agency;
  serviceLine: ServiceLine;
  hasBeenActivated: boolean;
}
