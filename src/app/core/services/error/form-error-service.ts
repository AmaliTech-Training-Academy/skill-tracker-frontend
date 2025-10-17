import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppError, AppErrorType } from '../../models/app-error.model';
import { ErrorHandlerService } from './error-handler';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  private readonly errorHandler = inject(ErrorHandlerService);

  mapApiErrors(form: FormGroup, appError: AppError): boolean {
    if (appError.type === AppErrorType.CLIENT && appError.validationErrors) {
      for (const validationError of appError.validationErrors) {
        const control = form.get(validationError.field);

        if (control) {
          control.setErrors({ apiError: validationError.message });
        }
      }
      return true;
    } else {
      this.errorHandler.notifyError(appError);
      return false;
    }
  }
}
