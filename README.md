# Product Management UI (Angular)

A minimal Angular frontend for managing products, designed to work with the Product Management API.

---

## Table of Contents

- [Quick Start](#quick-start)  
- [Development Setup](#development-setup)  
- [Proxy Configuration](#proxy-configuration)  
- [Project Structure](#project-structure)  
- [Components & Services](#components--services)  
- [Architecture & State Management](#architecture--state-management)  
- [Docker Run](#docker-run)
- [Assessment / Goals](#assessment--goals)  
- [Next Steps & Improvements](#next-steps--improvements)  

---

## Quick Start

```bash
cd frontend
npm install
npx ng serve --project=frontend --open
```
The app assumes the backend API is available under /api/catalogproducts. If it's not reachable, sample data may be used for demonstration.

## Development Setup
Uses Angular standalone components (Angular 19+).

Uses Bootstrap (CSS only) for styling, imported via angular.json.

Requires HttpClientModule to be imported for API integration.

Proxy Configuration (for Local Development)

To forward API requests to your backend during development, you can use a proxy. Create a file frontend/proxy.conf.json with:
```json
{
  "/api": {
	"target": "http://localhost:5000",
	"secure": false
  }
}
```
Then run the Angular development server with:
```bash
npx ng serve --project=frontend --proxy-config proxy.conf.json --open
```
## Project Structure
- **src/app/components**: Contains Angular components for product listing, details, and forms.  
- **src/app/services**: Contains services for API communication and state management.  
- **src/app/models**: Contains TypeScript interfaces/models for Product and related data structures.
## Components & Services
- **ProductListComponent**: Displays a list of products with options to view, edit, or delete.  
- **ProductDetailComponent**: Shows detailed information about a selected product.  
- **ProductFormComponent**: Form for creating or editing products with validation.  
- **ProductService**: Handles API calls to the backend for CRUD operations on products.	
## Architecture & State Management
- Uses Angular's built-in services for state management.
- Components communicate with ProductService to fetch and manipulate product data.

## Docker Run

To run the Angular frontend in a Docker container, use the following command:
```bash
docker-compose up --build
```
The Angular UI will be available at http://localhost:8082
The frontend will connect to the backend API at http://localhost:8080
 (as configured in environment.ts in Dockerfile).


## Assessment / Goals
- Implement the product management UI with Angular.
- Ensure seamless integration with the Product Management API.
- Provide a user-friendly interface for managing products.
