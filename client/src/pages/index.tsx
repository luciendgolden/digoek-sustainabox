import React, { ReactElement, Suspense, useEffect } from 'react';
import LandingLayout from '@/components/app/LandingLayout'
import { NextPageWithLayout } from './_app';
import Head from 'next/head';
import Hero from '@/components/app/Hero';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/joy';
import { useRouter } from 'next/router';
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { InferGetServerSidePropsType } from 'next';
import { Session } from 'next-auth';
import Loading from '@/components/app/Loading';

// When user authenticated redirect to dashboard
export const getServerSideProps = (async (context: any) => {
  {console.log(process.env.NEXTAUTH_URL)}
  {console.log(process.env.BACKEND_URL)}
  const session: Session | null = await getServerSession(context.req, context.res, authOptions)
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
});

const LandingPage: NextPageWithLayout = ({ session }: any) => {
  return (
    <Hero />
  );
};

LandingPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Landing Page</title>
      </Head>
      <LandingLayout>{page}</LandingLayout>
    </>
  );
};

export default LandingPage;