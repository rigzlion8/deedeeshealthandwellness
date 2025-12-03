import { useSession } from 'next-auth/react';
import Head from 'next/head';

const CheckoutPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Checkout | DeeDees Health &amp; Wellness</title>
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Secure Checkout</h1>
          <p className="mt-3 text-slate-500">
            {session?.user
              ? `Signed in as ${session.user.email || session.user.name}.`
              : 'Sign in to continue your purchase.'}
          </p>
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            Cart management and payment integration will appear here soon.
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

