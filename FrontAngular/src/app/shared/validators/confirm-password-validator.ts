import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password').value;
  const confirmedPassword = control.get('confirmedPassword').value;
  const isSamePassword = password === confirmedPassword;
  return isSamePassword ? null : { isSamePassword: true };
};
