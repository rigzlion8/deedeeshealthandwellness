import { signIn, useSession } from 'next-auth/react';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Checking admin session...
      </div>
    );
  }

  if (session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Access Required</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in with Google to manage DeeDees Health &amp; Wellness.
        </p>
        <div className="mt-6 space-y-4">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGuard;

