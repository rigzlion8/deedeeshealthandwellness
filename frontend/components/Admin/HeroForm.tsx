import { useState } from 'react';
import type { HeroSettings } from '../../lib/api';

type HeroFormProps = {
  initialData: HeroSettings;
  onSubmit: (data: Partial<HeroSettings>) => Promise<void>;
  onUploadImage: (file: File) => Promise<{ url: string }>;
};

const HeroForm = ({ initialData, onSubmit, onUploadImage }: HeroFormProps) => {
  const [formState, setFormState] = useState<HeroSettings>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (key: keyof HeroSettings, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
    setFormState((prev) => {
      const stats = prev.stats ? [...prev.stats] : [];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(formState);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await onUploadImage(file);
      if (result.url) {
        setFormState((prev) => ({ ...prev, imageUrl: result.url }));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Hero Title</label>
          <input
            className="w-full rounded-xl border border-slate-200 p-3"
            value={formState.title}
            onChange={(event) => handleChange('title', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Subtitle</label>
          <input
            className="w-full rounded-xl border border-slate-200 p-3"
            value={formState.subtitle}
            onChange={(event) => handleChange('subtitle', event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">CTA Text</label>
          <input
            className="w-full rounded-xl border border-slate-200 p-3"
            value={formState.ctaText}
            onChange={(event) => handleChange('ctaText', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">CTA Link</label>
          <input
            className="w-full rounded-xl border border-slate-200 p-3"
            value={formState.ctaLink}
            onChange={(event) => handleChange('ctaLink', event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Hero Image</label>
        <div className="flex flex-wrap items-center gap-4">
          {formState.imageUrl && (
            <div className="relative h-40 w-64 overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formState.imageUrl} alt="Hero" className="h-full w-full object-cover" />
            </div>
          )}
          <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-500">
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Stats</p>
          <button
            type="button"
            className="text-sm font-semibold text-primary-600"
            onClick={() =>
              setFormState((prev) => ({
                ...prev,
                stats: [...(prev.stats || []), { label: '', value: '' }],
              }))
            }
          >
            + Add stat
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(formState.stats || []).map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="space-y-2 rounded-2xl border border-slate-200 p-4">
              <input
                className="w-full rounded-xl border border-slate-200 p-2 text-sm"
                placeholder="Label"
                value={stat.label}
                onChange={(event) => handleStatChange(index, 'label', event.target.value)}
              />
              <input
                className="w-full rounded-xl border border-slate-200 p-2 text-sm"
                placeholder="Value"
                value={stat.value}
                onChange={(event) => handleStatChange(index, 'value', event.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? 'Saving...' : 'Save Hero'}
        </button>
      </div>
    </form>
  );
};

export default HeroForm;

