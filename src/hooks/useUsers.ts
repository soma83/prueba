import { useEffect } from 'react';
import { useAppDispatch, useAppState } from '../context/AppContext';
import { api } from '../services/api';

export function useUsers() {
  const { users, isUsersLoading, error } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      dispatch({ type: 'SET_USERS_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      try {
        const data = await api.users.getAll();
        if (!cancelled) {
          dispatch({ type: 'SET_USERS', payload: data });
        }
      } catch (err) {
        if (!cancelled) {
          dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch users' });
        }
      } finally {
        if (!cancelled) {
          dispatch({ type: 'SET_USERS_LOADING', payload: false });
        }
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { users, isLoading: isUsersLoading, error };
}