import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductStateService } from '../core/store/product-state.service';
import { HttpResolverService } from '../core/http-resolver.service';
import { ApiResponse } from '../core/models/api-response.model';
import { API_BASE_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = API_BASE_URL;
  constructor(
    private http: HttpClient,
    private state: ProductStateService,
    private resolver: HttpResolverService
  ) {}

  getAll(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}api/catalogproducts`).pipe(
      map(raw => this.resolver.unwrapApiResponse<Product[]>(raw).data ?? []),
      tap(products => this.state.set(products)),
      catchError(err => {
        const errorMessage = this.resolver.parseError(err);
        console.warn('API unreachable, returning sample data —', errorMessage);
        const sample = [
          { id: 1, name: 'Sample A', price: 9.99, description: 'Demo product A' },
          { id: 2, name: 'Sample B', price: 19.99, description: 'Demo product B' }
        ] as Product[];
        // still populate state with sample data so components can read it
        this.state.set(sample);
        return of(sample);
      })
    );
  }

  getById(id: number): Observable<Product | null> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}api/catalogproducts/${id}`).pipe(
      map(raw => this.resolver.unwrapApiResponse<Product>(raw).data ?? null),
      catchError(err => {
        const errorMessage = this.resolver.parseError(err);
        console.warn('GetById failed —', errorMessage);
        return of(null);
      })
    );
  }

  create(product: Product): Observable<Product | null> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}api/catalogproducts`, product).pipe(
      map(raw => {
        const data = this.resolver.unwrapApiResponse<Product>(raw).data ?? null;
        if (data) this.state.add(data);
        return data;
      }),
      catchError(err => {
        const errorMessage = this.resolver.parseError(err);
        console.warn('Create failed —', errorMessage);
        return of(null);
      })
    );
  }

  update(product: Product): Observable<Product | null> {
    // The API returns 204 NoContent on success. If the body is empty we'll
    // optimistically update the local state with the provided product so the UI
    // reflects the change immediately. If your API returns the updated entity,
    // the server-response path will still handle it.
    return this.http.put<void>(`${this.baseUrl}api/catalogproducts/${product.id}`, product).pipe(
      map(() => {
        // Server returned no content; update state from local product
        this.state.update(product);
        return product;
      }),
      catchError(err => {
        const errorMessage = this.resolver.parseError(err);
        console.warn('Update failed —', errorMessage);
        return of(null);
      })
    );
  }

  delete(id: number): Observable<boolean> {
    // Backend returns 204 NoContent. Treat a successful response as a deletion
    // and update local state accordingly.
    return this.http.delete<void>(`${this.baseUrl}api/catalogproducts/${id}`).pipe(
      map(() => {
        this.state.remove(id);
        return true;
      }),
      catchError(err => {
        const errorMessage = this.resolver.parseError(err);
        console.warn('Delete failed —', errorMessage);
        return of(false);
      })
    );
  }
}
