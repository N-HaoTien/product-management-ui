import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
 * Small helper service used by components/services to normalize HTTP errors
 * and apply common retry/backoff strategies (implemented in callers).
 */
@Injectable({ providedIn: 'root' })
export class HttpResolverService {
  parseError(err: unknown): string {
    if (!err) return 'Unknown error';
    if (err instanceof HttpErrorResponse) {
      if (err.error && typeof err.error === 'string') return err.error;
      return `${err.status} ${err.statusText || ''}`.trim();
    }
    if (err instanceof Error) return err.message;
    return JSON.stringify(err);
  }

  // convenience wrapper to rethrow with normalized message
  toError$(err: unknown): Observable<never> {
    return throwError(() => new Error(this.parseError(err)));
  }
  
  /**
   * Normalize the API response wrapper coming from the backend.
   * The backend type is ApiResponse<T> with properties named either
   * PascalCase (Success/Data/Message/Meta) or camelCase (success/data/...).
   * This returns a normalized shape where property names are camelCase.
   */
  unwrapApiResponse<T>(raw: any): { success: boolean; data?: T | null; message?: string | null; meta?: any | null } {
    if (!raw) return { success: false, data: null, message: null, meta: null };
    const success = raw.Success ?? raw.success ?? false;
    const data = raw.Data ?? raw.data ?? null;
    const message = raw.Message ?? raw.message ?? null;
    const meta = raw.Meta ?? raw.meta ?? null;
    return { success, data, message, meta };
  }
}
