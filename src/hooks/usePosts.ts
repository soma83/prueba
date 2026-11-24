import { useEffect } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { api } from '../services/api';

export function usePosts() {
  const { selectedUser, posts, isPostsLoading } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!selectedUser) {
      dispatch({ type: 'SET_POSTS', payload: [] });
      return;
    }

    const userId = selectedUser.id;
    let cancelled = false;

    async function fetchPosts() {
      dispatch({ type: 'SET_POSTS_LOADING', payload: true });

      try {
        const data = await api.posts.getByUserId(userId);
        if (!cancelled) {
          dispatch({ type: 'SET_POSTS', payload: data });
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        if (!cancelled) {
          dispatch({ type: 'SET_POSTS_LOADING', payload: false });
        }
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [selectedUser, dispatch]);

  return { posts, isLoading: isPostsLoading };
}