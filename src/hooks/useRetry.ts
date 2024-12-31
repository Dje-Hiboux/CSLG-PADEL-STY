import { useState, useCallback } from 'react';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export function useRetry(config: RetryConfig = {}) {
  const { maxRetries, initialDelay, maxDelay, backoffFactor } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setRetryCount(0);
    setError(null);
  }, []);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void,
  ): Promise<T | null> => {
    try {
      const result = await operation();
      reset();
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      
      if (retryCount < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffFactor, retryCount),
          maxDelay
        );
        
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeWithRetry(operation, onSuccess, onError);
      }
      
      setError(error);
      onError?.(error);
      return null;
    }
  }, [retryCount, maxRetries, initialDelay, maxDelay, backoffFactor, reset]);

  return {
    executeWithRetry,
    retryCount,
    error,
    reset,
  };
}