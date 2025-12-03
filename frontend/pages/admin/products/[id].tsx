import { useRouter } from 'next/router';
import { useEffect, useState, type ReactElement } from 'react';
import AdminGuard from '../../../components/Admin/AdminGuard';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ProductForm from '../../../components/Admin/ProductForm';
import {
  fetchProduct,
  updateProduct,
  uploadImage,
  type ProductPayload,
} from '../../../lib/api';
import type { NextPageWithLayout } from '../../_app';
import type { ProductType } from '../../../components/Products/ProductCard';

const AdminEditProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    const run = async () => {
      try {
        setLoading(true);
        const result = await fetchProduct(id);
        setProduct(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (payload: ProductPayload) => {
    if (typeof id !== 'string') throw new Error('Product id missing.');
    await updateProduct(id, payload);
    router.push('/admin/products');
  };

  const handleUpload = async (file: File) => {
    return uploadImage(file, 'products');
  };

  if (loading) {
    return <p className="text-slate-500">Loading product...</p>;
  }

  if (error || !product) {
    return <p className="text-red-600">{error || 'Product not found.'}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500">Catalog</p>
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
      </div>
      <ProductForm
        initialData={product as unknown as ProductPayload}
        onSubmit={handleSubmit}
        onUploadImage={handleUpload}
        submitLabel="Update Product"
      />
    </div>
  );
};

AdminEditProductPage.getLayout = (page: ReactElement) => (
  <AdminGuard>
    <AdminLayout>{page}</AdminLayout>
  </AdminGuard>
);

export default AdminEditProductPage;

