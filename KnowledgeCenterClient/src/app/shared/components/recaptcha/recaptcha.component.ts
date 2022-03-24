import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.less']
})
export class RecaptchaComponent implements OnInit {

  @Input() parentForm: FormGroup;

  constructor(@Inject('RECAPTCHA') public recaptchaToken: string) { }

  ngOnInit() {
    if (this.recaptchaToken) { // If not recaptcha token let's consider to do not use captcha (typically for e2e testing purpose)
      this.parentForm.addControl('captcha', new FormControl('', Validators.required));
    }
  }

}
