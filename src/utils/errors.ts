// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error && 'message' in error) {
    return String(error.message);
  }
  return 'Une erreur inattendue est survenue';
}