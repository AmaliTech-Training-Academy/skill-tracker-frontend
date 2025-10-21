import { FormControl, FormGroup } from '@angular/forms';

export function getFormControl(form: FormGroup, controlName: string): FormControl {
  return form.get(controlName) as FormControl;
}
