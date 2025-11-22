# Frontend (Angular)

This is a minimal Angular frontend scaffold for the Product Management UI.

Quick start

1. From `frontend/` run:

```bash
npm install
npx ng serve --project=frontend --open
```

The app expects backend product endpoints under `/api/products`. If the backend is unreachable, the UI shows sample data.

Notes
- This project uses standalone components (Angular 19).
- If you don't have the Angular CLI globally, `npx ng` will use the local CLI.
 - This project uses standalone components (Angular 19).
 - The app uses Bootstrap for quick styling (installed via npm). The Bootstrap CSS is referenced in `angular.json`.
 - To forward API requests to your backend while developing, create a `proxy.conf.json` in `frontend/` with content like:

```json
{
	"/api": { "target": "http://localhost:5000", "secure": false }
}
```

Then run `npx ng serve --project=frontend --proxy-config proxy.conf.json --open`.


Assessment & Evaluation Criteria
--------------------------------

This project was built to meet the front-end assessment requirements: integrate a product UI with backend APIs and demonstrate architecture, state management, API handling, and performance considerations. Below I map the evaluation criteria to the current project and note any gaps.

1) Project structure
- Implemented: Components are organized under `src/app/product/` with per-component folders (`list/`, `form/`, `detail/`) and a barrel `src/app/product/index.ts`. Core/shared helpers live under `src/app/core/` (HTTP resolver and RxJS store).
- Notes / gaps: The app uses standalone components (no NgModule) which keeps the structure lightweight. A full NgRx feature slice is NOT implemented — there is a lightweight RxJS `ProductStateService` instead. Scaffolding for NgRx can be added (see next steps).

2) UI layout
- Implemented: Bootstrap 5 is used for layout and quick styling. The product list uses a responsive table; add/edit uses a modal-style overlay (CSS-only implementation). Forms use Bootstrap form controls and client-side validation.
- Notes / gaps: The modal uses a CSS-only approach (no Bootstrap JS or ng-bootstrap). For production-grade accessibility and focus management, consider integrating Angular CDK Overlay or `ng-bootstrap`.

3) Technology stack choices
- State management: Lightweight RxJS store (`ProductStateService`) with BehaviorSubject. This is suitable for small apps. Optional NgRx wiring is left as a next step.
- API client: Angular `HttpClient` via `ProductService`.
- File uploader: Not implemented — if required, recommend `ngx-file-drop` or native `<input type="file">` handling + multipart POST with progress via `HttpClient`.
- UI framework: Bootstrap 5 (CSS) is used. Optionally could be swapped to Tailwind / Material / Chakra; instructions available on request.

4) API and data handling
- Implemented: `ProductService` wraps HTTP calls (getAll/getById/create/update/delete) and normalizes failures with `catchError`. The service populates the RxJS store on successful responses. Components consume `ProductStateService.products$` for a single source of truth.
- Validation: Basic client-side validation exists in `product-form` via template-driven validation. Server-side validation should be validated by looking at HTTP error payloads — the project includes an `HttpResolverService` in `src/app/core/` to normalize HTTP errors (you can extend it to parse server validation responses). Unit tests for validation are not included.

 - Using `HttpResolverService` in the app: The project includes `src/app/core/http-resolver.service.ts` which provides `parseError()` and `toError$()` helpers. `ProductService` uses `HttpResolverService.parseError()` to produce normalized error messages and logging for all HTTP failures. If you need richer behavior (retry/backoff, mapping server-validation errors into form errors), extend `HttpResolverService` or use its `parseError()` output inside `catchError` and `retryWhen` pipelines.

 Example (already used in code):

 ```ts
 // inside ProductService
 this.http.get('/api/products').pipe(
	 tap(products => this.state.set(products)),
	 catchError(err => {
		 const msg = this.resolver.parseError(err);
		 console.warn('Get failed —', msg);
		 // you may rethrow: return this.resolver.toError$(err);
		 return of([]);
	 })
 );
 ```

5) Performance
- Implemented baseline: server calls are centralized in `ProductService`, and the RxJS store decouples components from direct HTTP calls. The code is modular and uses standalone components for smaller bundles.
- Recommendations / gaps:
	- Code splitting & lazy loading: currently the app is small and not lazily loading features. For larger apps, convert feature areas into lazy-loaded routes or load standalone feature components dynamically.
	- Caching/invalidations: Basic behavior is to refresh state after mutations; add ETag/If-None-Match, TTL caching, or SW-based caching for offline/fast loads.
	- Error handling & retries: `HttpResolverService` exists but is minimal — add retry/backoff (RxJS retryWhen), circuit-breaker logic, and nicer UI toasts for failures.

What's implemented (quick checklist)
- [x] Angular 19 standalone components
- [x] Product list, form, detail components with separate HTML/CSS files
- [x] `ProductService` (HttpClient) for API calls
- [x] `ProductStateService` (BehaviorSubject) for central store
- [x] Modal-based add/edit UX (CSS-only Bootstrap modal)
- [x] Bootstrap styling and responsive layout

Known gaps / recommended additions (to fully meet all assessment points)
- [ ] Full NgRx integration (actions/effects/reducers/selectors) — useful for large apps and time-travel/debugging.
- [ ] File uploader support for product images/files.
- [ ] Accessibility improvements for modal (focus trap, ESC to close, ARIA attributes) — integrate Angular CDK overlay or `ng-bootstrap`.
- [ ] Unit & e2e tests covering core flows (load list, create, update, delete, validation). Currently tests are not included.
- [ ] Performance features: lazy-loading features, caching strategies (ETag, TTL), and offline support if needed.

How the current code maps to acceptance criteria (pass/fail)
- Project structure: PASS — components and core services are organized and reusable.
- UI Layout: PASS (basic styling & responsive). For a production evaluation consider adding accessibility and richer interactions.
- State management: PASS (lightweight RxJS store). For full marks in a large-scale assessment, consider NgRx.
- API & Data handling: PARTIAL — API integration is implemented; improved server-validation handling and unit tests are missing.
- Performance: PARTIAL — modular and small-scale optimizations present; advanced optimizations (lazy loading, caching, retry policies) are recommendations.

Run instructions (quick)

```bash
cd frontend
npm install
npm start
```

Notes: If you prefer `npx ng serve` with a proxy to your local backend, run:

```bash
npx ng serve --project=frontend --proxy-config proxy.conf.json --open
```

Suggested immediate next steps (low-effort, high-value)
- Add a focused unit test suite for `ProductService` and `ProductStateService` (Jest or Karma + Jasmine).
- Integrate `ng-bootstrap` or Angular CDK overlay to get accessible modals and avoid hand-rolling modal behavior.
- Add a simple file-upload field to `product-form` and a matching API endpoint handling (multipart).
- Scaffold NgRx feature module if you expect the app to scale.

If you'd like, I can implement any of the missing items above. Tell me which to prioritize (NgRx, modal accessibility, file uploader, tests) and I'll update the project and README to reflect the implemented changes.
