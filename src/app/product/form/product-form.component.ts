import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../product.model';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Input() model: Product = { id: 0, name: '', price: 0, description: '' };
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    this.save.emit({ ...this.model });
  }

  onCancel() {
    this.cancel.emit();
  }
}
