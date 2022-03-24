import * as customValidators from './CustomValidators';
import { FormBuilder, FormGroup } from '@angular/forms';

const isNumeric = customValidators.IsNumeric('numericField');
const mustMatch = customValidators.MustMatch('numericField', 'numericFieldConfirm');
const isValidEmail = customValidators.IsValidEmail('emailField');
let form: FormGroup;

describe('CustomValidator', () => {

  beforeEach(() => {
    initData();
  });

  describe('mustMatch', () => {
    it('should not apply mustMatch error on the formgroup\'s fields when no value is given in both fields', () => {
      mustMatch(form);

      expect(form.controls.numericFieldConfirm.errors).toBeNull();
    });

    it('should not apply mustMatch error on the formgroup\'s fields when both fields have the same value', () => {
      form.controls.numericField.setValue('123');
      form.controls.numericFieldConfirm.setValue('123');

      mustMatch(form);

      expect(form.controls.numericFieldConfirm.errors).toBeNull();
    });

    it('should apply mustMatch error on the formgroup\'s fields when each field has a different value', () => {
      form.controls.numericField.setValue('123');
      form.controls.numericFieldConfirm.setValue('456');

      mustMatch(form);

      expect(form.controls.numericFieldConfirm.errors.mustMatch).toBeTruthy();
    });
  });

  describe('isNumeric', () => {
    it('should not apply isNumeric error on the formgroup\'s numericField control when no value is given', () => {
      isNumeric(form);

      expect(form.controls.numericField.errors).toBeNull();
    });

    it('should not apply isNumeric error on the formgroup\'s numericField control when a numeric value is given', () => {
      form.controls.numericField.setValue('123');

      isNumeric(form);

      expect(form.controls.numericField.errors).toBeNull();
    });

    it('should apply isNumeric error on the formgroup\'s numericField control when a non numeric value is given', () => {
      form.controls.numericField.setValue('abc');

      isNumeric(form);

      expect(form.controls.numericField.errors.isNumeric).toBeTruthy();
    });
  });

  describe('isInvalidEmail', () => {
    it('should not apply isInvalidEmail error on the formgroup\'s emailField control when no value is given', () => {
      isValidEmail(form);

      expect(form.controls.emailField.errors).toBeNull();
    });

    it('should not apply isInvalidEmail error on the formgroup\'s emailField control when correct capgemini address is given', () => {
      form.controls.emailField.setValue('test@capgemini.com');

      isValidEmail(form);

      expect(form.controls.emailField.errors).toBeNull();
    });

    it('should apply isInvalidEmail error on the formgroup\'s emailField control when a non correct capgemini address is given', () => {
      form.controls.emailField.setValue('test@hotmail.fr');

      isValidEmail(form);

      expect(form.controls.emailField.errors.isInvalidEmail).toBeTruthy();
    });
  });

  function initData(): void {
    form = new FormBuilder().group({
      numericField: [''],
      numericFieldConfirm: [''],
      emailField: ['']
    }, { validators: [isNumeric, mustMatch, isValidEmail] }
  );
  }
});
