import Head from 'next/head';
import useSWR from 'swr';
import Link from 'next/link';

type OrderSummary = {
  _id: string;
  orderNumber: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
  createdAt?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const OrdersPage = () => {
  const { data, error } = useSWR<OrderSummary[]>('/api/orders', fetcher);

  return (
    <>
      <Head>
        <title>My Orders | DeeDees Health &amp; Wellness</title>
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Orders
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Orders</h1>
            <p className="mt-2 text-slate-500">
              Track your purchases and payment status.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              Failed to load orders.
            </p>
          )}

          {!data && !error && (
            <p className="text-slate-500">Loading orders...</p>
          )}

          {data && data.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-600">No orders yet.</p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700"
              >
                Shop Products
              </Link>
            </div>
          )}

          {data && data.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {order.orderNumber || order._id}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-700">
                        {order.status || 'processing'}
                      </td>
                      <td className="px-4 py-4 capitalize text-slate-700">
                        {order.paymentStatus || 'pending'}
                      </td>
                      <td className="px-4 py-4 text-slate-900">
                        {order.totalAmount != null ? `KSh ${order.totalAmount}` : '—'}
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;

