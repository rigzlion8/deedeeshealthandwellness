import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const UserMenu = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => signIn('google')}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700"
      >
        <Image
          src={session.user.image || '/logo-mark.png'}
          alt={session.user.name || 'User avatar'}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="hidden sm:inline">{session.user.name || 'Account'}</span>
      </Link>
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Sign out
      </button>
    </div>
  );
};

export default UserMenu;

