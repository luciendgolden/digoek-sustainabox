// components/Layout.js
import React from 'react';
import LandingNavbar from './LandingNavbar';
import RootLayout from './RootLayout';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <RootLayout>
        <LandingNavbar />
        <main>{children}</main>
      </RootLayout>
  );
};

export default LandingLayout;
