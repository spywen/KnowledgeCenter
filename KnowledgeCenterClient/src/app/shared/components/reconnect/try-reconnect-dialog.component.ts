import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenService } from 'src/app/shared/services/token.service';
import { Credentials } from '../../models/Credentials';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tokens } from '../../models/Tokens';

@Component({
  selector: 'app-try-reconnect-dialog',
  templateUrl: './try-reconnect-dialog.html'
})
export class TryReconnectDialogComponent {

  public reconnectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TryReconnectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Credentials,
    private authService: AuthService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder) {
      this.reconnectForm = this.formBuilder.group({
        login: [this.data.login, [Validators.required]],
        password: ['', [Validators.required]]
      });
    }

  tryLogin(): void {
    this.authService.login(this.reconnectForm.getRawValue())
      .subscribe((tokens: Tokens) => {
        this.tokenService.setTokens(tokens);
        this.dialogRef.close(true);
      }, () => {
        this.reconnectForm.patchValue({password: ''});
      });
  }

  logout(): void {
    this.dialogRef.close(false);
  }

}
