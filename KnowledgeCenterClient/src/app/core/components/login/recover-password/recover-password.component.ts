import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecoverPasswordService } from 'src/app/core/services/recover-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TooltipService } from 'src/app/shared/services/tooltip.service';
import { MustMatch } from 'src/app/shared/helpers/CustomValidators';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.less']
})
export class RecoverPasswordComponent implements OnInit {

  @ViewChild('passwordRecovered', { static: true })
  public passwordRecoveredTemplate: TemplateRef<any>;

  public recoverPasswordForm: FormGroup;
  private token: string;

  constructor(
    private formBuilder: FormBuilder,
    private recoverPasswordService: RecoverPasswordService,
    private router: Router,
    private route: ActivatedRoute,
    public tooltipService: TooltipService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });

    this.recoverPasswordForm = this.formBuilder.group({
      token: [this.token, Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(3)]],
      newPasswordConfirmation: ['', [Validators.required]],
    }, {validators: [MustMatch('newPassword', 'newPasswordConfirmation')]});
  }

  formControls(formControlName: string) { return this.recoverPasswordForm.controls[formControlName]; }

  recoverPassword() {
    this.recoverPasswordService.recover(this.recoverPasswordForm.getRawValue())
      .subscribe(() => {
        this.tooltipService.info(this.passwordRecoveredTemplate);
        this.router.navigate(['login']);
      });
  }

}
