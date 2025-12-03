import Link from 'next/link';
import { useEffect, useState, type ReactElement } from 'react';
import AdminGuard from '../../../components/Admin/AdminGuard';
import AdminLayout from '../../../components/Admin/AdminLayout';
import type { ProductType } from '../../../components/Products/ProductCard';
import { deleteProduct, fetchProducts } from '../../../lib/api';
import type { NextPageWithLayout } from '../../_app';

const AdminProductsPage: NextPageWithLayout = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({ limit: 100, sort: '-createdAt' });
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this product?');
    if (!confirmed) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary-500">Catalog</p>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">Manage DeeDees inventory and hero selections.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          + New Product
        </Link>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Loading products...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            typeof product.images?.[0] === 'string'
                              ? product.images?.[0] || '/placeholder-product.jpg'
                              : product.images?.[0]?.url || '/placeholder-product.jpg'
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-600">{product.category}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">KSh {product.price}</td>
                  <td className="px-4 py-4 text-slate-600">{product.inStock ? 'In stock' : 'Out'}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isFeatured ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {product.isFeatured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        disabled={!token}
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

AdminProductsPage.getLayout = (page: ReactElement) => (
  <AdminGuard>
    <AdminLayout>{page}</AdminLayout>
  </AdminGuard>
);

export default AdminProductsPage;

