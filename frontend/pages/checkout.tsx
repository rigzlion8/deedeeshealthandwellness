import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [contact, setContact] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    county: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'cod'>('paystack');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => subtotal, [subtotal]);
  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  // Paystack supports NGN, GHS, USD, ZAR. We’ll charge in a supported currency and show KSh in UI.
  const displayCurrency = process.env.NEXT_PUBLIC_DISPLAY_CURRENCY || 'KES';
  const paystackChargeCurrencyEnv = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'NGN';
  const chargeCurrencyWhitelist = ['NGN', 'GHS', 'USD', 'ZAR'];
  const paystackCurrency = chargeCurrencyWhitelist.includes(paystackChargeCurrencyEnv.toUpperCase())
    ? paystackChargeCurrencyEnv.toUpperCase()
    : 'NGN';
  // FX rate from display currency (e.g., KES) to charge currency (e.g., NGN)
  const fxRate = Number(process.env.NEXT_PUBLIC_PAYSTACK_FX_RATE || '1'); // e.g., set KES->NGN rate

  const handlePay = () => {
    if (!paystackKey) {
      setError('Payment key missing. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.');
      return;
    }
    if (!contact.email || !contact.name) {
      setError('Please provide your name and email.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setError(null);
    setStatus('processing');

    const chargeAmount = Math.round(total * fxRate * 100); // Paystack expects lowest denomination of charge currency

    const handler = (window as any).PaystackPop?.setup({
      key: paystackKey,
      email: contact.email,
      amount: chargeAmount,
      currency: paystackCurrency,
      ref: `DD-${Date.now()}`,
      metadata: {
        name: contact.name,
        phone: contact.phone,
        address: contact.address,
        city: contact.city,
        county: contact.county,
        cart: items,
        displayCurrency,
      },
      callback: (response: any) => {
        setStatus('success');
        clearCart();
      },
      onClose: () => {
        setStatus('idle');
      },
    });

    if (!handler) {
      setStatus('idle');
      setError('Payment library not loaded. Please try again.');
      return;
    }

    handler.openIframe();
  };

  return (
    <>
      <Head>
        <title>Checkout | DeeDees Health &amp; Wellness</title>
      </Head>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
                Checkout
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Secure Checkout</h1>
              <p className="mt-3 text-slate-500">
                {session?.user
                  ? `Signed in as ${session.user.email || session.user.name}.`
                  : 'Sign in to continue your purchase.'}
              </p>
            </div>
            <Link href="/cart" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              ← Back to cart
            </Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Contact & Delivery</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm text-slate-600">Full Name</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Email</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Phone</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+254712345678"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm text-slate-600">Address</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    placeholder="Street, building, apartment"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">City</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    value={contact.city}
                    onChange={(e) => setContact({ ...contact, city: e.target.value })}
                    placeholder="Nairobi"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">County</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 p-3"
                    value={contact.county}
                    onChange={(e) => setContact({ ...contact, county: e.target.value })}
                    placeholder="Kiambu"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Payment Method</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary-200">
                    <input
                      type="radio"
                      name="payment"
                      value="paystack"
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Card / Mobile Money (Paystack)</p>
                      <p className="text-sm text-slate-500">Secure payment powered by Paystack.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary-200">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Cash on Delivery</p>
                      <p className="text-sm text-slate-500">Pay when your order arrives.</p>
                    </div>
                  </label>
                </div>
              </div>
              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
              )}
              {status === 'success' && (
                <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  Payment successful! Thank you for your order.
                </p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
              {paymentMethod === 'paystack' ? (
                <>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={status === 'processing' || items.length === 0}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {status === 'processing' ? 'Processing...' : 'Pay with Paystack'}
                  </button>
                  <p className="mt-3 text-xs text-slate-500">
                    Secure payment powered by Paystack. Amount charged in KES.
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('processing');
                      setTimeout(() => {
                        clearCart();
                        setStatus('success');
                      }, 600);
                    }}
                    disabled={items.length === 0 || status === 'processing'}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {status === 'processing' ? 'Placing order...' : 'Place Order (Cash on Delivery)'}
                  </button>
                  <p className="mt-3 text-xs text-slate-500">
                    You will pay when the order is delivered.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

