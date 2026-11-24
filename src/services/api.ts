const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  users: {
    getAll: () => fetchJson<User[]>('/users'),
    getById: (id: number) => fetchJson<User>(`/users/${id}`)
  },
  posts: {
    getByUserId: (userId: number) => fetchJson<Post[]>(`/posts?userId=${userId}`),
    create: (post: CreatePostInput) => fetchJson<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    })
  }
};

import type { User, Post, CreatePostInput } from '../types/user';