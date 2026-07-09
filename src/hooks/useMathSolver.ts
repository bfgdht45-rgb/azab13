import { useState, useCallback } from 'react';
import type { MathSolution, MathSubject, SolverRequest } from '../types';
import { mathSolverAPI } from '../services/api';

export function useMathSolver() {
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solve = useCallback(async (request: SolverRequest) => {
    setIsLoading(true);
    setError(null);
    setSolution(null);

    try {
      const response = await mathSolverAPI.solve(request);
      if (response.success && response.solution) {
        setSolution(response.solution);
      } else {
        setError(response.error || 'فشل في حل المسألة');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setSolution(null);
    setError(null);
  }, []);

  return { solution, isLoading, error, solve, clear };
}
