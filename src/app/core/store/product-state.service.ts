import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../product/product.model';

/**
 * Lightweight RxJS-backed store for product list state.
 * This provides an alternative to NgRx for small apps; it exposes
 * a read-only observable and update methods.
 */
@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private _products = new BehaviorSubject<Product[]>([]);
  readonly products$: Observable<Product[]> = this._products.asObservable();

  set(products: Product[]) {
    this._products.next(products);
  }

  add(product: Product) {
    const cur = this._products.getValue();
    // Insert new products at the start so items ordered by descending id
    // (newest first) appear correctly in the UI without reloading.
    this._products.next([product, ...cur]);
  }

  update(updated: Product) {
    const cur = this._products.getValue();
    this._products.next(cur.map(product => product.id === updated.id ? updated : product));
  }

  remove(id: number) {
    const cur = this._products.getValue();
    this._products.next(cur.filter(product => product.id !== id));
  }

  getSnapshot(): Product[] {
    return this._products.getValue();
  }
}
