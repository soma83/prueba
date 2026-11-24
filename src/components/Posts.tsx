import { usePosts } from '../hooks/usePosts';

interface PostsProps {
  selectedUserName?: string;
}

const Posts = ({ selectedUserName }: PostsProps) => {
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Cargando publicaciones">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5" style={{ animationDuration: '2s' }}>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 110 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0V5a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0V5a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1H8a1 1 0 01-1-1v-3a1 1 0 011-1h3a1 1 0 011-1V5a2 2 0 014 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h-1a1 1 0 01-1-1v-3a1 1 0 01-1-1H8a1 1 0 01-1-1v-3a1 1 0 011-1h3a1 1 0 011-1V5a2 2 0 014 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Sin publicaciones aún</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {selectedUserName ? `${selectedUserName} no ha publicado nada` : 'No hay publicaciones disponibles'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Crea la primera publicación usando el formulario de abajo</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800" role="list" aria-label="Lista de publicaciones">
      {posts.map((post) => (
        <li key={post.id} className="py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-[transform,opacity,border-color,box-shadow] duration-200">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{post.body}</p>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default Posts;