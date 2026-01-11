import Loading from '@/components/app/Loading';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Button, Typography } from '@mui/joy';
import { signOut, useSession } from "next-auth/react";
import Head from 'next/head';
import { type ReactElement } from 'react';
import { NextPageWithLayout } from '../../_app';
import InventoryTable from '@/components/ui/InventoryTable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';


export const getServerSideProps = (async (context: any) => {
    // Fetch data from external API
    const session: any = await getServerSession(context.req, context.res, authOptions)
    const supplierId = session?.user?._id;
    const res = await fetch(`${process.env.BACKEND_URL}/api/products/inventory`);
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    {console.log("serverside: ", backendUrl)}
    
    const inventory = await res.json();

    // Pass data to the page via props
    return { props: { inventory, backendUrl } }
  })

const AdminDashboardPage: NextPageWithLayout = ({inventory,backendUrl}:any) => {
    {console.log("clientside: ", backendUrl)}
    const { data: session, status } = useSession();
    const user = session?.user;
    console.log("User: ", session?.user);
    if (status === "loading") {
        return <Loading />
    }

    return (
        <Box sx={{ display: 'flex',  alignItems: 'center' }}>
            <InventoryTable data={inventory} user={user} backendUrl={backendUrl}></InventoryTable>
        </Box>
    );
};

AdminDashboardPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>Admin Dashboard Page</title>
            </Head>
            <DashboardLayout pageTitle="Dashboard">{page}</DashboardLayout>;
        </>
    );
};

export default AdminDashboardPage;

