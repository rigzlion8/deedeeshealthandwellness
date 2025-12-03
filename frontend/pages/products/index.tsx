import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ProductGrid from '../../components/Products/ProductGrid';
import type { ProductType } from '../../components/Products/ProductCard';
import { fetchProducts } from '../../lib/api';

type ProductsPageProps = {
  products: ProductType[];
};

const ProductsPage = ({ products }: ProductsPageProps) => {
  return (
    <>
      <Head>
        <title>Products | DeeDees Health &amp; Wellness</title>
      </Head>
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
              Catalog
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Explore DeeDees Products</h1>
            <p className="mt-3 text-slate-500">
              Herbal remedies, skincare, teas, and supplements crafted in Kenya.
            </p>
          </header>

          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              <p className="text-lg font-semibold text-slate-700">Products arriving soon</p>
              <p className="mt-2">
                We&apos;re curating new items. Check back later or{' '}
                <Link href="/" className="text-primary-600 underline">
                  go home
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async () => {
  const products = await fetchProducts({ limit: 50, sort: '-createdAt' });

  return {
    props: {
      products,
    },
  };
};

export default ProductsPage;

