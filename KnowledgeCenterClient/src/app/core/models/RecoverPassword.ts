export interface AskForRecoverPassword {
  email: string;
}

export interface RecoverPassword {
  token: string;
  newPassword: string;
}
