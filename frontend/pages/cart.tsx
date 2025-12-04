import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <Head>
        <title>Cart | DeeDees Health &amp; Wellness</title>
      </Head>

      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-500">
                Cart
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Basket</h1>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Clear cart
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              <p>Your cart is empty.</p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
              >
                Shop Products
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-lg font-semibold text-slate-900 hover:text-primary-600"
                      >
                        {item.name}
                      </Link>
                      {item.sizeValue && item.sizeUnit && (
                        <p className="text-sm text-slate-500">
                          Size: {item.sizeValue}
                          {item.sizeUnit}
                        </p>
                      )}
                      <p className="text-sm text-slate-500">
                        Price: KSh {(item.discountPrice ?? item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center rounded-full border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-4 py-2 text-slate-600 hover:text-slate-900"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-4 py-2 text-slate-600 hover:text-slate-900"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
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
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary-700"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

