import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventBusService } from '../../utilities/services/event-bus.service';
import { NotificationService } from '../../utilities/services/notification.service';
import { ValidationService } from '../services/validation.service';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected isLoading = false;
  protected error: string | null = null;

  constructor(
    protected eventBus: EventBusService,
    protected notificationService: NotificationService,
    protected validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.onInit();
    this.setupEventSubscriptions();
  }

  ngOnDestroy(): void {
    this.onDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Override this method to add custom initialization logic.
   */
  protected onInit(): void {}

  /**
   * Override this method to add custom cleanup logic.
   */
  protected onDestroy(): void {}

  /**
   * Sets up event subscriptions. Override to add custom subscriptions.
   */
  protected setupEventSubscriptions(): void {
    // Subscribe to common events
    this.eventBus.subscribeToData<any>('error:occurred')
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.handleError(error));

    this.eventBus.subscribeToData<string>('success:occurred')
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.handleSuccess(message));
  }

  /**
   * Handles loading state.
   */
  protected setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Handles error state.
   */
  protected setError(error: string | null): void {
    this.error = error;
  }

  /**
   * Handles errors from the event bus.
   */
  protected handleError(error: any): void {
    const message = error?.message || error?.error || 'An error occurred';
    this.notificationService.error(message);
    this.setError(message);
  }

  /**
   * Handles success messages from the event bus.
   */
  protected handleSuccess(message: string): void {
    this.notificationService.success(message);
  }

  /**
   * Validates a form control.
   */
  protected validateControl(control: any, rules: string[]): boolean {
    const result = this.validationService.validateControl(control, rules);
    if (!result.isValid) {
      this.setError(result.errors[0]);
    }
    return result.isValid;
  }

  /**
   * Validates multiple form controls.
   */
  protected validateControls(controls: { [key: string]: any }, rules: { [key: string]: string[] }): boolean {
    const result = this.validationService.validateControls(controls, rules);
    if (!result.isValid) {
      this.setError(result.errors[0]);
    }
    return result.isValid;
  }

  /**
   * Emits a data change event.
   */
  protected emitDataChanged<T>(dataType: string, data: T): void {
    this.eventBus.emitDataChanged(dataType, data);
  }

  /**
   * Emits a data deletion event.
   */
  protected emitDataDeleted(dataType: string, id: number): void {
    this.eventBus.emitDataDeleted(dataType, id);
  }

  /**
   * Emits a data creation event.
   */
  protected emitDataCreated<T>(dataType: string, data: T): void {
    this.eventBus.emitDataCreated(dataType, data);
  }

  /**
   * Emits an error event.
   */
  protected emitError(error: any, context?: string): void {
    this.eventBus.emitError(error, context);
  }

  /**
   * Emits a success event.
   */
  protected emitSuccess(message: string, context?: string): void {
    this.eventBus.emitSuccess(message, context);
  }

  /**
   * Sets state for a specific key.
   */
  protected setState<T>(key: string, value: T): void {
    this.eventBus.setState(key, value);
  }

  /**
   * Gets current state for a specific key.
   */
  protected getState<T>(key: string): T | undefined {
    return this.eventBus.getState<T>(key);
  }

  /**
   * Subscribes to state changes for a specific key.
   */
  protected subscribeToState<T>(key: string): void {
    this.eventBus.subscribeToState<T>(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.onStateChange(key, value));
  }

  /**
   * Override this method to handle state changes.
   */
  protected onStateChange<T>(key: string, value: T): void {}
}