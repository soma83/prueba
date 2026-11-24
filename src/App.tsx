import { AppProvider, useAppState } from './context/AppContext';
import { useState } from 'react';
import Header from './components/Header';
import UserList from './components/UserList';
import Posts from './components/Posts';
import CreatePostDialog from './components/CreatePostDialog';

const AppContent = () => {
  const { selectedUser } = useAppState();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop: Sidebar layout (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <section className="lg:col-span-1" aria-labelledby="users-heading">
            <h2 id="users-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-balance">
              Usuarios
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 h-full">
              <UserList />
            </div>
          </section>

          <section className="lg:col-span-2 space-y-6" aria-labelledby="posts-heading">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 id="posts-heading" className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-balance">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Publicaciones
              </h2>
              {selectedUser && (
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva publicación
                </button>
              )}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <Posts />
            </div>
          </section>
        </div>

        {/* Mobile: Inline detail below selected user (< lg) */}
        <div className="lg:hidden">
          <section aria-labelledby="users-heading-mobile">
            <h2 id="users-heading-mobile" className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-balance">
              Usuarios
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <UserList isMobileInline />
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Datos de{' '}
          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded"
          >
            JSONPlaceholder
          </a>
        </div>
      </footer>

      <CreatePostDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;