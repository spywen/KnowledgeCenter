import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecoverPasswordService } from 'src/app/core/services/recover-password.service';
import { AskForRecoverPassword } from 'src/app/core/models/RecoverPassword';
import { Router } from '@angular/router';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { IsValidEmail } from 'src/app/shared/helpers/CustomValidators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild('justAskedToRecoverPassword', { static: true })
  public justAskedToRecoverPasswordTemplate: TemplateRef<any>;

  public forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private recoverPasswordService: RecoverPasswordService,
    private router: Router,
    public tooltipService: TooltipService) { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    }, {validators: [IsValidEmail('email')]});
  }

  formControls(formControlName: string) { return this.forgotPasswordForm.controls[formControlName]; }

  askForPasswordRecovery() {
    this.recoverPasswordService.ask({ email: this.forgotPasswordForm.get('email').value} as AskForRecoverPassword)
    .subscribe(() => {
      this.tooltipService.info(this.justAskedToRecoverPasswordTemplate);
      this.router.navigate(['login']);
    });
  }

}
