import { useEffect, useState, type ReactElement } from 'react';
import AdminGuard from '../../../components/Admin/AdminGuard';
import AdminLayout from '../../../components/Admin/AdminLayout';
import HeroForm from '../../../components/Admin/HeroForm';
import { fetchHeroSettings, updateHeroSettings, uploadImage, type HeroSettings } from '../../../lib/api';
import type { NextPageWithLayout } from '../../_app';

const AdminHeroPage: NextPageWithLayout = () => {
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchHeroSettings();
      setHero(data);
    };
    load();
  }, []);

  const handleSubmit = async (payload: Partial<HeroSettings>) => {
    const updated = await updateHeroSettings(payload);
    setHero(updated);
    setMessage('Hero banner updated successfully.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpload = async (file: File) => {
    return uploadImage(file, 'hero');
  };

  if (!hero) {
    return <p className="text-slate-500">Loading hero settings...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500">Homepage</p>
        <h1 className="text-3xl font-bold text-slate-900">Hero Banner</h1>
        <p className="text-sm text-slate-500">Update hero copy, call to action, and featured imagery.</p>
      </div>
      {message && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      <HeroForm initialData={hero} onSubmit={handleSubmit} onUploadImage={handleUpload} />
    </div>
  );
};

AdminHeroPage.getLayout = (page: ReactElement) => (
  <AdminGuard>
    <AdminLayout>{page}</AdminLayout>
  </AdminGuard>
);

export default AdminHeroPage;

