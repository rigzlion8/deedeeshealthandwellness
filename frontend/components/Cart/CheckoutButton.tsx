import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const CheckoutButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (session?.user) {
      router.push('/checkout');
    } else {
      router.push('/auth/signin?callback=/checkout');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={status === 'loading'}
      className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {status === 'loading' ? 'Preparing checkout...' : 'Proceed to Checkout'}
    </button>
  );
};

export default CheckoutButton;

