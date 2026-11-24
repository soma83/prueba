import { useAppState, useAppDispatch } from '../context/AppContext';
import type { Theme } from '../context/AppContext';

const themeLabels: Record<Theme, string> = {
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  };

const Header = () => {
  const { theme, isMenuOpen } = useAppState();
  const dispatch = useAppDispatch();

  const handleThemeChange = (newTheme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: newTheme });
    dispatch({ type: 'CLOSE_MENU' });
  };

  const handleToggleMenu = () => {
    dispatch({ type: 'TOGGLE_MENU' });
  };

  const handleCloseMenu = () => {
    dispatch({ type: 'CLOSE_MENU' });
  };

  

  const renderThemeIcon = (t: Theme) => {
    switch (t) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10" data-menu-root>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-balance">
              Usuarios & Publicaciones
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Prueba Técnica con JSONPlaceholder API
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleToggleMenu}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="Menú de opciones"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 animate-in fade-in-0 zoom-in-95 duration-150"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tema
                  </p>
                </div>
                <div className="py-1">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      role="menuitemradio"
                      aria-checked={theme === t}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800 ${
                        theme === t ? 'text-primary font-medium' : ''
                      }`}
                    >
                      {renderThemeIcon(t)}
                      <span>{themeLabels[t]}</span>
                      {theme === t && (
                        <svg className="w-4 h-4 ml-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 my-2" />

                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contacto
                  </p>
                </div>
                <div className="py-1 px-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Adalberto Somarriba Montero</p>
                    <p className="text-xs">Implementado para la prueba técnica</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a
                      href="mailto:somarriba@gmail.com"
                      className="text-primary hover:underline"
                      onClick={handleCloseMenu}
                    >
                      somarriba@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href="tel:+5354586315"
                      className="text-primary hover:underline"
                      onClick={handleCloseMenu}
                    >
                      +53 54586315
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;