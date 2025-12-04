import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import Layout from '../components/Layout/Layout';
import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session?: Session }> & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { session, ...restPageProps } = pageProps;
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  const page = <Component {...restPageProps} />;

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Head>
          <link rel="icon" href="/logo-mark.png" />
          <meta name="theme-color" content="#0EA5E9" />
          <title>DeeDees Health &amp; Wellness</title>
        </Head>
        {getLayout(page)}
      </CartProvider>
    </SessionProvider>
  );
};

export default App;

