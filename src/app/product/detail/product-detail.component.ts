import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductStateService } from '../../core/store/product-state.service';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnChanges {
  @Input() productId?: number;
  product: Product | null = null;

  constructor(private productService: ProductService, private state: ProductStateService) {
    // subscribe to store and pick the item when state changes
    this.state.products$.subscribe(list => {
      if (this.productId != null) {
        this.product = list.find(x => x.id === this.productId) || null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId != null) {
      // try to read from state first; fallback to API if not present
      const found = this.state.getSnapshot().find(x => x.id === this.productId);
      if (found) {
        this.product = found;
      } else {
        this.productService.getById(this.productId).subscribe(product => this.product = product);
      }
    }
  }
}
