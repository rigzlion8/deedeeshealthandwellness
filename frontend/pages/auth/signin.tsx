import { getProviders, signIn } from 'next-auth/react';
import type { GetServerSideProps } from 'next';

type SignInProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
  callbackUrl: string;
};

const SignInPage = ({ providers, callbackUrl }: SignInProps) => {
  const googleProvider = providers?.google;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">Sign in</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome to DeeDees</h1>
        <p className="mt-2 text-sm text-slate-500">
          To continue, sign in with Google and you&apos;ll be redirected back where you left off.
        </p>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-700"
            onClick={() => signIn('google', { callbackUrl })}
            disabled={!googleProvider}
          >
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SignInProps> = async ({ query }) => {
  const providers = await getProviders();
  const callbackParam = typeof query.callback === 'string' ? query.callback : '/';
  return {
    props: {
      providers,
      callbackUrl: callbackParam,
    },
  };
};

export default SignInPage;

