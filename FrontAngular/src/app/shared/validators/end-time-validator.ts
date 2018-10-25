import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const endTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startTime = control.get('startTime').value;
  const endTime = control.get('endTime').value;
  let endTimeBeforeStartTime = false;

  if (!endTime || !startTime) {
    return { endTimeBeforeStartTime }
  }
  const startTimeInMinutes = startTime.length === 5 ? +startTime.slice(0, 2) * 60 + +startTime.slice(3) : null;
  const endTimeInMinutes = endTime.length === 5 ? +endTime.slice(0, 2) * 60 + +endTime.slice(3) : null;

  if (startTimeInMinutes & endTimeInMinutes) {
    endTimeBeforeStartTime = startTimeInMinutes > endTimeInMinutes;
  }

  return endTimeBeforeStartTime ? { endTimeBeforeStartTime } : null;
};
