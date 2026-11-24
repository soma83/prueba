import { useState, type FormEvent } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { api } from '../services/api';
import type { CreatePostInput } from '../types/user';

const CreatePostForm = () => {
  const { selectedUser } = useAppState();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePostInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Partial<Record<keyof CreatePostInput, string>> = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    if (!body.trim()) newErrors.body = 'El texto es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedUser) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newPost = await api.posts.create({
        title: title.trim(),
        body: body.trim(),
        userId: selectedUser.id,
      });
      dispatch({ type: 'ADD_POST', payload: newPost });
      setTitle('');
      setBody('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700" noValidate>
      <h3 className="font-medium text-gray-900 dark:text-white text-balance">Nueva publicación</h3>

      {submitError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg border border-red-200 dark:border-red-800 text-sm" role="alert" aria-live="polite">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => validate()}
          autoComplete="off"
          spellCheck={false}
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors ${
            errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          } bg-white dark:bg-gray-800`}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="post-body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Texto <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => validate()}
          rows={4}
          autoComplete="off"
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors resize-y ${
            errors.body ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          } bg-white dark:bg-gray-800`}
          aria-invalid={errors.body ? 'true' : 'false'}
          aria-describedby={errors.body ? 'body-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.body && (
          <p id="body-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert" aria-live="polite">
            {errors.body}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
      >
        {isSubmitting ? 'Creando…' : 'Crear publicación'}
      </button>
    </form>
  );
};

export default CreatePostForm;