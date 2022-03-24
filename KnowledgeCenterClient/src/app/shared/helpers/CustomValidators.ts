import { FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export function IsNumeric(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors) {
      return;
    }

    if (!control.value.toString().match('^[0-9]*$')) {
      control.setErrors({ isNumeric: true });
    } else {
      control.setErrors(null);
    }
  };
}

export function IsValidEmail(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors) {
      return;
    }

    if (control.value && !control.value.match('^([\\w\\.\\-]+)@capgemini.com$')) {
      control.setErrors({ isInvalidEmail: true });
    } else {
      control.setErrors(null);
    }
  };
}
