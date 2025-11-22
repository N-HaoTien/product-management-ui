import { Component } from '@angular/core';
import { ProductListComponent } from './product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent],
  template: `
    <main>
      <h1>Product Management</h1>
      <product-list></product-list>
    </main>
  `,
  styles: [`main{ padding: 16px; }`]
})
export class AppComponent {}
