import { useState, type FormEvent, type ReactNode } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { api } from '../services/api';
import type { CreatePostInput } from '../types/user';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const CreatePostDialog = ({ isOpen, onClose }: CreatePostDialogProps) => {
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
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!selectedUser || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={handleClose} />
        <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            <div className="flex items-center justify-between">
              <h2 id="dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                Nueva publicación
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                aria-label="Cerrar diálogo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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
                autoFocus
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
              >
                {isSubmitting ? 'Creando…' : 'Crear publicación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostDialog;