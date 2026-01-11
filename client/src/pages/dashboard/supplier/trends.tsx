import React, { ReactElement, useState } from 'react';
import { NextPageWithLayout } from '../../_app';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Head from 'next/head';
import TrendChart from '@/components/ui/TrendChart';
import { useSession } from 'next-auth/react';

export const getServerSideProps = (async (context: any) => {
  const backendUrl = process.env.BACKEND_URL_BROWSER;
  return {
      props : {
          backendUrl
      }
  }
});


const SupplierDashboardPage: NextPageWithLayout = ({ trend,backendUrl }: any) => {
  // Your existing code...
    const { data: session, status }: any = useSession();
    const supplierId = session?.user?._id;
    return (
    <div>
        <Head>
            <title>Supplier Dashboard Page</title>
        </Head>
        <TrendChart backendUrl={backendUrl}/>
    </div>
  );
};

SupplierDashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Supplier Dashboard Page</title>
      </Head>
      <DashboardLayout pageTitle="Supplier Dashboard">{page}</DashboardLayout>;
    </>
  );
};

export default SupplierDashboardPage;
