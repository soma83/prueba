import { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types/user';

const UserList = () => {
  const { users, searchQuery, isUsersLoading, error } = useAppState();
  const dispatch = useAppDispatch();
  useUsers();

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleUserSelect = (user: User) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  if (isUsersLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Cargando usuarios">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse" style={{ animationDuration: '2s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-3" role="alert" aria-live="polite">
        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-medium">Error al cargar usuarios</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="user-search" className="sr-only">
          Buscar usuarios
        </label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="user-search"
            type="search"
            placeholder="Buscar por nombre, usuario o email…"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent bg-white dark:bg-gray-800 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
            aria-describedby="search-hint"
          />
        </div>
        <span id="search-hint" className="sr-only">
          Escribe para filtrar la lista de usuarios
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 px-4">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {searchQuery ? 'Intenta con otro término de búsqueda' : 'Parece que no hay usuarios en este momento'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800" role="list" aria-label="Lista de usuarios">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => handleUserSelect(user)}
                className="w-full px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset transition-all duration-150 group active:bg-gray-100 dark:active:bg-gray-800"
                aria-pressed={false}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 flex items-center justify-center text-primary font-semibold group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;