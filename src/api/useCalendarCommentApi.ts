import { useState } from 'react';
import {
  getCommentByDate,
  getCommentsByMonth,
  upsertComment,
  deleteComment
} from '@/services/calendarCommentService';

export function useCalendarCommentApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(fn: (...args: any[]) => Promise<T>, ...params: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn(...params);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCommentByDate: (workerId: string, date: string, token: string) => apiCall(getCommentByDate, workerId, date, token),
    getCommentsByMonth: (workerId: string, year: number, month: number, token: string) =>
      apiCall(getCommentsByMonth, workerId, year, month, token),
    upsertComment: (input: { workerId: string; date: string; comment: string }, token: string) =>
      apiCall(upsertComment, input, token),
    deleteComment: (commentId: string, token: string) =>
      apiCall(deleteComment, commentId, token),
    loading,
    error,
  };
}
