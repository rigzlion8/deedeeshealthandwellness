import Link from 'next/link';
import type { ReactElement } from 'react';
import AdminGuard from '../../components/Admin/AdminGuard';
import AdminLayout from '../../components/Admin/AdminLayout';
import type { NextPageWithLayout } from '../_app';

const AdminDashboardPage: NextPageWithLayout = () => {
  const shortcuts = [
    { title: 'Add Product', href: '/admin/products/new', description: 'Create a new product listing.' },
    { title: 'Manage Products', href: '/admin/products', description: 'Edit inventory and pricing.' },
    { title: 'Hero Banner', href: '/admin/site/hero', description: 'Update homepage hero content.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, Admin</h1>
        <p className="mt-2 text-slate-500">
          Manage DeeDees Health &amp; Wellness products, hero content, and analytics from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">
              {item.title}
            </p>
            <p className="mt-3 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

AdminDashboardPage.getLayout = (page: ReactElement) => (
  <AdminGuard>
    <AdminLayout>{page}</AdminLayout>
  </AdminGuard>
);

export default AdminDashboardPage;

