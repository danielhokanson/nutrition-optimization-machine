import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ErrorResponse {
  message: string;
  error: string;
  timestamp: string;
  path?: string;
  method?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService<T> {
  protected apiUrl: string;

  constructor(
    protected http: HttpClient,
    endpoint: string
  ) {
    this.apiUrl = `${environment.apiUrl}/${endpoint}`;
  }

  /**
   * Retrieves all items.
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves an item by ID.
   */
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new item.
   */
  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.apiUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing item.
   */
  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes an item by ID.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Performs a custom GET request.
   */
  protected get<TResult>(url: string): Observable<TResult> {
    return this.http.get<TResult>(url).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Performs a custom POST request.
   */
  protected post<TResult>(url: string, data?: any): Observable<TResult> {
    return this.http.post<TResult>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Performs a custom PUT request.
   */
  protected put<TResult>(url: string, data?: any): Observable<TResult> {
    return this.http.put<TResult>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Performs a custom DELETE request.
   */
  protected delete<TResult>(url: string): Observable<TResult> {
    return this.http.delete<TResult>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors consistently across all requests.
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      const errorResponse = error.error as ErrorResponse;
      errorMessage = errorResponse?.message || `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}