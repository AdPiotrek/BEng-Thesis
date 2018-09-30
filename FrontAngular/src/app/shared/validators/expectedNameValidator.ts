import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';



export function expectedNameValidator(expectedName: string): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    return expectedName === control.value ? null : {expectedName: expectedName}
  }
}
