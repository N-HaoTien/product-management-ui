export interface ApiResponse<T> {
  // backend uses PascalCase (Success/Data/Message/Meta) but many serializers
  // emit camelCase. We'll keep this interface permissive and handle both casings
  // in the HttpResolverService.
  success?: boolean;
  Success?: boolean;
  data?: T | null;
  Data?: T | null;
  message?: string | null;
  Message?: string | null;
  meta?: Record<string, unknown> | null;
  Meta?: Record<string, unknown> | null;
}
