import { useState } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { token, setToken, isReady } = useAdminAuth();
  const [input, setInput] = useState('');

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Checking admin session...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-slate-900">Admin Access Required</h1>
          <p className="mt-2 text-sm text-slate-500">
            Paste a valid DeeDees admin JWT token to continue. Tokens are issued via the
            authentication API.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (input.trim()) {
                setToken(input.trim());
              }
            }}
          >
            <label className="text-sm font-medium text-slate-700" htmlFor="admin-token">
              Admin token
            </label>
            <textarea
              id="admin-token"
              className="h-32 w-full rounded-xl border border-slate-200 p-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;

