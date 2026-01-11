// components/Layout.js
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import RootLayout from '../app/RootLayout';
import Header from './Header';
import Sidebar from './Sidebar';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useRouter } from 'next/router';
import { NextLinkComposed } from '../link/Link';
import { useSession } from 'next-auth/react';
import Loading from '../app/Loading';


const DashboardLayout = ({ children, pageTitle }: { children: React.ReactNode, pageTitle: string }) => {
  const { data: session, status } = useSession();
  
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Function to dynamically generate breadcrumbs based on the current path
    const generateBreadcrumbs = () => {
      const pathWithoutQuery = router.asPath.split('?')[0]; // Remove query parameters
      let pathArray = pathWithoutQuery.split('/').filter((i) => i); // Split and filter empty strings

      const breadcrumbs: any = pathArray.map((path, index) => {
        const href = '/' + pathArray.slice(0, index + 1).join('/');
        return {
          text: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize first letter
          href: href,
        };
      });

      // Prepend the home link
      breadcrumbs.unshift({ text: 'Home', href: '/' });

      setBreadcrumbs(breadcrumbs);
    };

    generateBreadcrumbs();
  }, [router.asPath]);

  
  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <RootLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header />
        <Sidebar user={session?.user} />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            ml: {
              md: 'var(--Sidebar-width)',
            },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            gap: 1,
            overflow: 'auto',
            height: '100vh'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              {breadcrumbs.map((breadcrumb: any, index) => {
                if (breadcrumb.text === 'Home') {
                  return (
                    <Link
                      key={breadcrumb.href}
                      component={NextLinkComposed}
                      to={{
                        pathname: breadcrumb.href,
                      }}
                      underline="hover"
                      color="neutral"
                      aria-label="Home"
                    >
                      <HomeRoundedIcon /> {/* Render Home icon */}
                    </Link>
                  );
                }

                // For the last item (current page), don't render a link
                if (index === breadcrumbs.length - 1) {
                  return (
                    <Typography
                      key={breadcrumb.href}
                      color="primary"
                      fontWeight={500}
                      fontSize={12}
                    >
                      {breadcrumb.text}
                    </Typography>
                  );
                }

                // For other items, render a link
                return (
                  <Link
                    key={breadcrumb.href}
                    component={NextLinkComposed}
                    to={{
                      pathname: breadcrumb.href,
                    }}
                    underline="hover"
                    color="neutral"
                    fontSize={12}
                    fontWeight={500}
                  >
                    {breadcrumb.text}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              {pageTitle}
            </Typography>
          </Box>
          {children}
        </Box>
      </Box>
    </RootLayout>
  );

};

export default DashboardLayout;
