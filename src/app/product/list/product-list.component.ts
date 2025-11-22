import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { ProductStateService } from '../../core/store/product-state.service';
import { Product } from '../product.model';
import { ProductFormComponent } from '../form/product-form.component';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];
  editing: Product = { id: 0, name: '', price: 0, description: '' };
  showModal = false; // show modal dialog for add/edit
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService, private state: ProductStateService) {
  // subscribe to store so UI updates automatically
  this.state.products$.subscribe(products => this.products = products || []);
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.productService.getAll().subscribe({
      next: () => { this.loading = false; },
      error: err => { this.error = 'Failed to load products'; this.loading = false; }
    });
  }

  startCreate() {
    this.editing = { id: 0, name: '', price: 0, description: '' };
    this.openModal();
  }

  edit(product: Product) {
    this.editing = { ...product };
    this.openModal();
  }

  onSave(product: Product) {
    if (product.id) {
      this.productService.update(product).subscribe(() => {/* state updated inside service */});
    } else {
      this.productService.create(product).subscribe(() => {/* state updated inside service */});
    }
    this.closeModal();
  }

  onCancel() {
    this.closeModal();
  }

  confirmDelete(id: number) {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe(success => { if (!success) this.error = 'Failed to delete'; });
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }
}
