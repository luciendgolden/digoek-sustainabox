// components/Layout.js
import React from 'react';
import ThemeRegistry from '@/components/theme-registry/ThemeRegistry';
import Head from 'next/head';
import { Box } from '@mui/joy';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeRegistry>
        <Head>
          <meta name="description" content="" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>{children}</main>
      </ThemeRegistry>
    </>

  );
};

export default RootLayout;
