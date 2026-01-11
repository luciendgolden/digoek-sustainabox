import '@/styles/globals.css'
import { useState, type ReactElement, type ReactNode, useEffect } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import Loading from '@/components/app/Loading'
import { Session } from 'next-auth'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

// Add generic type
type AppPropsWithLayout<P> = AppProps<P> & { 
  Component: NextPageWithLayout<P>; 
}; 

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout<{ session: Session; }>) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component session={session} {...pageProps} />);

  return <SessionProvider session={session}>{layout}</SessionProvider>;

}
