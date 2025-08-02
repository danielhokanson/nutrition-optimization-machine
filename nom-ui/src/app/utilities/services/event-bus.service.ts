import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppEvent<T = any> {
  type: string;
  data?: T;
  timestamp: Date;
  source?: string;
}

export interface TypedEvent<T> extends AppEvent<T> {
  data: T;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventBus = new Subject<AppEvent>();
  private typedSubjects = new Map<string, Subject<any>>();
  private stateSubjects = new Map<string, BehaviorSubject<any>>();

  /**
   * Publishes an event to all subscribers.
   */
  publish<T>(event: string, data?: T, source?: string): void {
    const appEvent: AppEvent<T> = {
      type: event,
      data,
      timestamp: new Date(),
      source
    };
    this.eventBus.next(appEvent);
  }

  /**
   * Subscribes to all events.
   */
  subscribe(): Observable<AppEvent> {
    return this.eventBus.asObservable();
  }

  /**
   * Subscribes to events of a specific type.
   */
  subscribeTo<T>(eventType: string): Observable<TypedEvent<T>> {
    return this.eventBus.pipe(
      filter(event => event.type === eventType),
      map(event => event as TypedEvent<T>)
    );
  }

  /**
   * Subscribes to events of a specific type and extracts only the data.
   */
  subscribeToData<T>(eventType: string): Observable<T> {
    return this.subscribeTo<T>(eventType).pipe(
      map(event => event.data)
    );
  }

  /**
   * Gets or creates a typed subject for a specific event type.
   */
  private getTypedSubject<T>(eventType: string): Subject<T> {
    if (!this.typedSubjects.has(eventType)) {
      this.typedSubjects.set(eventType, new Subject<T>());
    }
    return this.typedSubjects.get(eventType) as Subject<T>;
  }

  /**
   * Publishes to a typed subject.
   */
  publishTyped<T>(eventType: string, data: T): void {
    const subject = this.getTypedSubject<T>(eventType);
    subject.next(data);
  }

  /**
   * Subscribes to a typed subject.
   */
  subscribeTyped<T>(eventType: string): Observable<T> {
    const subject = this.getTypedSubject<T>(eventType);
    return subject.asObservable();
  }

  /**
   * Gets or creates a state subject for a specific key.
   */
  private getStateSubject<T>(key: string, initialValue?: T): BehaviorSubject<T> {
    if (!this.stateSubjects.has(key)) {
      this.stateSubjects.set(key, new BehaviorSubject<T>(initialValue as T));
    }
    return this.stateSubjects.get(key) as BehaviorSubject<T>;
  }

  /**
   * Sets state for a specific key.
   */
  setState<T>(key: string, value: T): void {
    const subject = this.getStateSubject<T>(key);
    subject.next(value);
  }

  /**
   * Gets current state for a specific key.
   */
  getState<T>(key: string): T | undefined {
    const subject = this.getStateSubject<T>(key);
    return subject.value;
  }

  /**
   * Subscribes to state changes for a specific key.
   */
  subscribeToState<T>(key: string): Observable<T> {
    const subject = this.getStateSubject<T>(key);
    return subject.asObservable();
  }

  /**
   * Convenience methods for common events
   */
  emitLogin(userInfo?: any): void {
    this.publish('auth:login', userInfo);
  }

  emitLogout(): void {
    this.publish('auth:logout');
  }

  emitClaimsLoaded(claims?: any): void {
    this.publish('auth:claims-loaded', claims);
  }

  emitUserInfoUpdated(userInfo: any): void {
    this.publish('user:info-updated', userInfo);
  }

  emitDataChanged<T>(dataType: string, data: T): void {
    this.publish(`data:${dataType}:changed`, data);
  }

  emitDataDeleted(dataType: string, id: number): void {
    this.publish(`data:${dataType}:deleted`, { id });
  }

  emitDataCreated<T>(dataType: string, data: T): void {
    this.publish(`data:${dataType}:created`, data);
  }

  emitError(error: any, context?: string): void {
    this.publish('error:occurred', { error, context });
  }

  emitSuccess(message: string, context?: string): void {
    this.publish('success:occurred', { message, context });
  }

  /**
   * Legacy method for backward compatibility
   */
  emit(event: AppEvent): void {
    this.publish(event.type, event.data, event.source);
  }

  /**
   * Legacy property for backward compatibility
   */
  public events$ = this.eventBus.asObservable();

  /**
   * Cleans up all subscriptions and subjects.
   */
  cleanup(): void {
    this.eventBus.complete();
    this.typedSubjects.forEach(subject => subject.complete());
    this.stateSubjects.forEach(subject => subject.complete());
    this.typedSubjects.clear();
    this.stateSubjects.clear();
  }
} 