export interface CreateOrUpdateUser {
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
  agencyId: number;
  serviceLineId: number;
}
