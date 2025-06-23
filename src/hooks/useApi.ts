
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (apiCall: () => Promise<any>, showToast: boolean = true) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      
      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null
        });
        
        if (showToast && response.message) {
          toast({
            title: "Success",
            description: response.message
          });
        }
        
        return response.data;
      } else {
        const errorMessage = response.error || 'An error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage
        });
        
        if (showToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
      
      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}
