import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ProductPayload } from '../../lib/api';

type ProductFormProps = {
  initialData?: Partial<ProductPayload>;
  onSubmit: (data: ProductPayload) => Promise<void>;
  onUploadImage: (file: File) => Promise<{ url: string }>;
  submitLabel?: string;
};

const defaultValues: ProductPayload = {
  name: '',
  slug: '',
  description: '',
  detailedDescription: '',
  price: 0,
  discountPrice: undefined,
  category: 'herbal',
  subcategory: '',
  images: [],
  ingredients: [],
  benefits: [],
  usageInstructions: '',
  stockQuantity: 0,
  minStockLevel: 0,
  isFeatured: false,
  isNewArrival: false,
  tags: [],
  metaTitle: '',
  metaDescription: '',
};

const categories = ['herbal', 'skincare', 'supplements', 'teas', 'oils'];

const ProductForm = ({
  initialData,
  onSubmit,
  onUploadImage,
  submitLabel = 'Save Product',
}: ProductFormProps) => {
  const form = useForm<ProductPayload>({
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
  });

  const [images, setImages] = useState<string[]>(
    (initialData?.images || []).map((image) =>
      typeof image === 'string' ? image : image.url || ''
    )
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await onUploadImage(file);
      if (result.url) {
        setImages((prev) => [...prev, result.url]);
      }
    } catch (err) {
      setError((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await onSubmit({
        ...values,
        images,
        ingredients: values.ingredients?.filter(Boolean),
        benefits: values.benefits?.filter(Boolean),
        tags: values.tags?.filter(Boolean),
      });
    } catch (err) {
      setError((err as Error).message);
    }
  });

  return (
    <form onSubmit={submitHandler} className="space-y-8">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('name', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('slug', { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Short Description</label>
        <textarea
          className="h-32 w-full rounded-xl border border-slate-200 p-3"
          {...form.register('description', { required: true })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Detailed Description</label>
        <textarea
          className="h-40 w-full rounded-xl border border-slate-200 p-3"
          {...form.register('detailedDescription')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="price">
            Price (KES)
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('price', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="discountPrice">
            Discount Price
          </label>
          <input
            type="number"
            step="0.01"
            id="discountPrice"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('discountPrice', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('category')}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="stockQuantity">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('stockQuantity', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="minStockLevel">
            Reorder Threshold
          </label>
          <input
            type="number"
            id="minStockLevel"
            className="w-full rounded-xl border border-slate-200 p-3"
            {...form.register('minStockLevel', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" {...form.register('isFeatured')} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" {...form.register('isNewArrival')} />
          New Arrival
        </label>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700">Product Images</label>
        <div className="flex flex-wrap gap-4">
          {images.map((url) => (
            <div key={url} className="relative h-32 w-32 overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Product" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-xs font-semibold text-slate-700 shadow"
                onClick={() => setImages((prev) => prev.filter((img) => img !== url))}
              >
                ✕
              </button>
            </div>
          ))}
          <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-500">
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleUpload(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Usage Instructions</label>
        <textarea
          className="h-32 w-full rounded-xl border border-slate-200 p-3"
          {...form.register('usageInstructions')}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {form.formState.isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

