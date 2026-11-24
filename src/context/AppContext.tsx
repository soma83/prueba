import { createContext, useContext, useReducer, type ReactNode, type Dispatch, useEffect } from 'react';
import type { User, Post } from '../types/user';

const POSTS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;
type PostsPerPage = typeof POSTS_PER_PAGE_OPTIONS[number];

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  users: User[];
  selectedUser: User | null;
  posts: Post[];
  searchQuery: string;
  isUsersLoading: boolean;
  isPostsLoading: boolean;
  error: string | null;
  postsPerPage: PostsPerPage;
  currentPage: number;
  theme: Theme;
  isMenuOpen: boolean;
}

type AppAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_SELECTED_USER'; payload: User | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_USERS_LOADING'; payload: boolean }
  | { type: 'SET_POSTS_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_POSTS_PER_PAGE'; payload: PostsPerPage }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'RESET_PAGINATION' }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CLOSE_MENU' };

const initialState: AppState = {
  users: [],
  selectedUser: null,
  posts: [],
  searchQuery: '',
  isUsersLoading: false,
  isPostsLoading: false,
  error: null,
  postsPerPage: 10,
  currentPage: 1,
  theme: 'system',
  isMenuOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload, posts: [], currentPage: 1 };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, currentPage: 1 };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts], currentPage: 1 };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_USERS_LOADING':
      return { ...state, isUsersLoading: action.payload };
    case 'SET_POSTS_LOADING':
      return { ...state, isPostsLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_POSTS_PER_PAGE':
      return { ...state, postsPerPage: action.payload, currentPage: 1 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'RESET_PAGINATION':
      return { ...state, currentPage: 1 };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case 'CLOSE_MENU':
      return { ...state, isMenuOpen: false };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.theme]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isMenuOpen) {
        dispatch({ type: 'CLOSE_MENU' });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isMenuOpen, dispatch]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (state.isMenuOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-menu-root]')) {
          dispatch({ type: 'CLOSE_MENU' });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.isMenuOpen, dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useAppState() {
  return useAppContext().state;
}

export function useAppDispatch() {
  return useAppContext().dispatch;
}

export { POSTS_PER_PAGE_OPTIONS };
export type { PostsPerPage, Theme };