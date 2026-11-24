// Mock matchMedia at module level before any imports
const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Apply to global window before vitest transforms
if (typeof window !== 'undefined') {
  window.matchMedia = matchMediaMock;
}

import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import UserList from './UserList';
import { AppProvider } from '../context/AppContext';
import type { User } from '../types/user';

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874', geo: { lat: '-37.3159', lng: '81.1496' } },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets' },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    address: { street: 'Victor Plains', suite: 'Suite 879', city: 'Wisokyburgh', zipcode: '90566-7771', geo: { lat: '-43.9509', lng: '-34.4618' } },
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: { name: 'Deckow-Crist', catchPhrase: 'Proactive didactic contingency', bs: 'synergize scalable supply-chains' },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    address: { street: 'Douglas Extension', suite: 'Suite 847', city: 'McKenzie', zipcode: '59590-4157', geo: { lat: '-68.6102', lng: '-47.0653' } },
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    company: { name: 'Romaguera-Jacobson', catchPhrase: 'Face to face bifurcated interface', bs: 'e-enable strategic applications' },
  },
];

const mockPosts = [
  { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
  { id: 2, userId: 1, title: 'Post 2', body: 'Body 2' },
  { id: 3, userId: 1, title: 'Post 3', body: 'Body 3' },
  { id: 4, userId: 1, title: 'Post 4', body: 'Body 4' },
  { id: 5, userId: 1, title: 'Post 5', body: 'Body 5' },
  { id: 6, userId: 1, title: 'Post 6', body: 'Body 6' },
];

// Test wrapper with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful user fetch
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders user list and allows search by name', async () => {
    renderWithProviders(<UserList />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
      expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
    });

    // Search by name
    const searchInput = screen.getByPlaceholderText(/buscar por nombre, usuario o email/i);
    await userEvent.type(searchInput, 'Leanne');

    // Should filter to only Leanne Graham
    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
      expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument();
    });
  });

  it('searches by username and email', async () => {
    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    // Search by username
    const searchInput = screen.getByPlaceholderText(/buscar por nombre, usuario o email/i);
    await userEvent.type(searchInput, 'Antonette');

    await waitFor(() => {
      expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
      expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
    });

    // Clear and search by email
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Nathan@yesenia.net');

    await waitFor(() => {
      expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
      expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    (global.fetch as vi.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProviders(<UserList />);

    // Should show skeleton loaders (at least one)
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('shows error state when fetch fails', async () => {
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    renderWithProviders(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar usuarios/i)).toBeInTheDocument();
    });
  });
});

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers }) // users
      .mockResolvedValue({ ok: true, json: async () => mockPosts }); // posts
  });

  it('shows pagination controls when user has 6 posts (default 5 per page)', async () => {
    renderWithProviders(<UserList isMobileInline />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    // Click on first user
    await userEvent.click(screen.getByText('Leanne Graham'));

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    // Should show pagination (6 posts > 5 per page)
    await waitFor(() => {
      expect(screen.getByText(/página 1 de 2/i)).toBeInTheDocument();
    });
  });

  it('does not show pagination when user has 3 posts', async () => {
    const fewPosts = mockPosts.slice(0, 3);
    (global.fetch as vi.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })
      .mockResolvedValue({ ok: true, json: async () => fewPosts });

    renderWithProviders(<UserList isMobileInline />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Leanne Graham'));

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    // Should NOT show pagination (3 posts <= 5 per page)
    expect(screen.queryByText(/página/i)).not.toBeInTheDocument();
  });
});

describe('Create Post Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers }) // users
      .mockResolvedValue({ ok: true, json: async () => mockPosts }); // posts
  });

  const openDialog = async () => {
    renderWithProviders(<UserList isMobileInline />);

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Leanne Graham'));

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    // Click create post button
    await userEvent.click(screen.getByRole('button', { name: /nueva publicación/i }));

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /nueva publicación/i })).toBeInTheDocument();
    });
  };

  it('opens dialog when clicking "Nueva publicación" button', async () => {
    await openDialog();

    // Form fields should be empty (query within dialog)
    const dialog = screen.getByRole('dialog', { name: /nueva publicación/i });
    expect(dialog).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    await openDialog();

    // Try to submit empty form
    await userEvent.click(screen.getByRole('button', { name: /crear publicación/i }));

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/el título es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el texto es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('creates post successfully and closes dialog', async () => {
    const newPost = { id: 101, userId: 1, title: 'Nuevo Post', body: 'Nuevo Body' };
    (global.fetch as vi.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })
      .mockResolvedValueOnce({ ok: true, json: async () => mockPosts })
      .mockResolvedValue({ ok: true, json: async () => newPost }); // create post

    await openDialog();

    // Fill form using dialog context
    const dialog = screen.getByRole('dialog', { name: /nueva publicación/i });
    const dialogScope = within(dialog);
    await userEvent.type(dialogScope.getByLabelText(/título/i), 'Nuevo Post');
    await userEvent.type(dialogScope.getByLabelText(/texto/i), 'Nuevo Body');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /crear publicación/i }));

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // New post should appear in list (at top)
    await waitFor(() => {
      expect(screen.getByText('Nuevo Post')).toBeInTheDocument();
    });
  });

  it('resets form when dialog is reopened', async () => {
    await openDialog();

    const dialog = screen.getByRole('dialog', { name: /nueva publicación/i });
    const dialogScope = within(dialog);
    // Fill form
    await userEvent.type(dialogScope.getByLabelText(/título/i), 'Test Title');
    await userEvent.type(dialogScope.getByLabelText(/texto/i), 'Test Body');

    // Close with cancel
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    // Reopen dialog
    await userEvent.click(screen.getByRole('button', { name: /nueva publicación/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /nueva publicación/i })).toBeInTheDocument();
    });

    // Form should be empty
    const newDialog = screen.getByRole('dialog', { name: /nueva publicación/i });
    const newDialogScope = within(newDialog);
    expect(newDialogScope.getByLabelText(/título/i)).toHaveValue('');
    expect(newDialogScope.getByLabelText(/texto/i)).toHaveValue('');
  });
});