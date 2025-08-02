import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ValidationRule {
  name: string;
  validator: ValidatorFn;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AsyncValidationResult {
  isValid: boolean;
  errors: string[];
  pending?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private commonValidators = new Map<string, ValidationRule>();

  constructor() {
    this.initializeCommonValidators();
  }

  /**
   * Validates a form control with common validation rules.
   */
  validateControl(control: AbstractControl, rules: string[]): ValidationResult {
    const errors: string[] = [];

    for (const ruleName of rules) {
      const rule = this.commonValidators.get(ruleName);
      if (rule) {
        const validationResult = rule.validator(control);
        if (validationResult) {
          errors.push(rule.message);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates multiple form controls.
   */
  validateControls(controls: { [key: string]: AbstractControl }, rules: { [key: string]: string[] }): ValidationResult {
    const allErrors: string[] = [];

    for (const [controlName, control] of Object.entries(controls)) {
      const controlRules = rules[controlName] || [];
      const result = this.validateControl(control, controlRules);
      allErrors.push(...result.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Creates a custom validator function.
   */
  createValidator(validatorFn: ValidatorFn, message: string): ValidationRule {
    return {
      name: 'custom',
      validator: validatorFn,
      message
    };
  }

  /**
   * Validates email format.
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) return null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) ? null : { email: true };
    };
  }

  /**
   * Validates password strength.
   */
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 8;

      const errors: ValidationErrors = {};
      if (!hasUpperCase) errors.uppercase = true;
      if (!hasLowerCase) errors.lowercase = true;
      if (!hasNumbers) errors.numbers = true;
      if (!hasSpecialChar) errors.specialChar = true;
      if (!isLongEnough) errors.length = true;

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validates URL format.
   */
  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const url = control.value;
      if (!url) return null;

      try {
        new URL(url);
        return null;
      } catch {
        return { url: true };
      }
    };
  }

  /**
   * Validates phone number format.
   */
  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phone = control.value;
      if (!phone) return null;

      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/\s/g, '')) ? null : { phone: true };
    };
  }

  /**
   * Validates that a value is a positive number.
   */
  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      const num = Number(value);
      return !isNaN(num) && num > 0 ? null : { positiveNumber: true };
    };
  }

  /**
   * Validates that a value is within a range.
   */
  rangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      const num = Number(value);
      if (isNaN(num)) return { range: true };

      return num >= min && num <= max ? null : { range: true };
    };
  }

  /**
   * Validates that a string has a minimum length.
   */
  minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return value.length >= minLength ? null : { minLength: true };
    };
  }

  /**
   * Validates that a string has a maximum length.
   */
  maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return value.length <= maxLength ? null : { maxLength: true };
    };
  }

  /**
   * Validates that a value matches a pattern.
   */
  patternValidator(pattern: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return pattern.test(value) ? null : { pattern: true };
    };
  }

  /**
   * Validates that a value is unique (async validation).
   */
  uniqueValidator<T>(
    checkFunction: (value: any) => Observable<T[]>,
    propertyName: string = 'value'
  ): ValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      if (!value) return of(null);

      return checkFunction(value).pipe(
        map(results => results.length === 0 ? null : { unique: true }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Gets validation error messages for a control.
   */
  getValidationErrors(control: AbstractControl): string[] {
    const errors: string[] = [];
    
    if (control.errors) {
      for (const [errorKey, errorValue] of Object.entries(control.errors)) {
        const errorMessage = this.getErrorMessage(errorKey, errorValue);
        if (errorMessage) {
          errors.push(errorMessage);
        }
      }
    }

    return errors;
  }

  /**
   * Gets a human-readable error message for a validation error.
   */
  getErrorMessage(errorKey: string, errorValue: any): string {
    const errorMessages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minlength: `Minimum length is ${errorValue.requiredLength} characters`,
      maxlength: `Maximum length is ${errorValue.requiredLength} characters`,
      pattern: 'Please enter a valid value',
      unique: 'This value must be unique',
      positiveNumber: 'Please enter a positive number',
      range: 'Please enter a value within the specified range',
      phone: 'Please enter a valid phone number',
      url: 'Please enter a valid URL',
      uppercase: 'Password must contain at least one uppercase letter',
      lowercase: 'Password must contain at least one lowercase letter',
      numbers: 'Password must contain at least one number',
      specialChar: 'Password must contain at least one special character',
      length: 'Password must be at least 8 characters long'
    };

    return errorMessages[errorKey] || 'Invalid value';
  }

  /**
   * Initializes common validation rules.
   */
  private initializeCommonValidators(): void {
    this.commonValidators.set('required', {
      name: 'required',
      validator: (control: AbstractControl) => control.value ? null : { required: true },
      message: 'This field is required'
    });

    this.commonValidators.set('email', {
      name: 'email',
      validator: this.emailValidator(),
      message: 'Please enter a valid email address'
    });

    this.commonValidators.set('password', {
      name: 'password',
      validator: this.passwordStrengthValidator(),
      message: 'Password does not meet requirements'
    });

    this.commonValidators.set('phone', {
      name: 'phone',
      validator: this.phoneValidator(),
      message: 'Please enter a valid phone number'
    });

    this.commonValidators.set('url', {
      name: 'url',
      validator: this.urlValidator(),
      message: 'Please enter a valid URL'
    });

    this.commonValidators.set('positiveNumber', {
      name: 'positiveNumber',
      validator: this.positiveNumberValidator(),
      message: 'Please enter a positive number'
    });
  }
}