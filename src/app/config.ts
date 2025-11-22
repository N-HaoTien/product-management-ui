// Central place to configure the API base URL used by services.
// For local development we rely on the Angular dev-server proxy (see proxy.conf.json)
// which proxies "/api" to http://localhost:5000. If you want to call the
// backend directly, change this value (for example: "http://localhost:5000/").
import { environment } from '../environments/environment';

export const API_BASE_URL: string = environment.apiBaseUrl ?? '/';
