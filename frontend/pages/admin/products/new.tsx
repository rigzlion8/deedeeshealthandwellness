import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import AdminGuard from '../../../components/Admin/AdminGuard';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ProductForm from '../../../components/Admin/ProductForm';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { createProduct, uploadImage, type ProductPayload } from '../../../lib/api';
import type { NextPageWithLayout } from '../../_app';

const AdminCreateProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = useAdminAuth();

  const handleSubmit = async (payload: ProductPayload) => {
    if (!token) throw new Error('Admin token missing.');
    await createProduct(payload, token);
    router.push('/admin/products');
  };

  const handleUpload = async (file: File) => {
    if (!token) throw new Error('Admin token missing.');
    return uploadImage(file, token, 'products');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500">Catalog</p>
        <h1 className="text-3xl font-bold text-slate-900">Create Product</h1>
      </div>
      <ProductForm onSubmit={handleSubmit} onUploadImage={handleUpload} submitLabel="Create Product" />
    </div>
  );
};

AdminCreateProductPage.getLayout = (page: ReactElement) => (
  <AdminGuard>
    <AdminLayout>{page}</AdminLayout>
  </AdminGuard>
);

export default AdminCreateProductPage;

