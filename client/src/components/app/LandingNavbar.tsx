import { Box, Button, Container, IconButton, Link, Typography } from '@mui/joy';
import RecyclingIcon from '@mui/icons-material/Recycling';
import NextLink from 'next/link';
import { NextLinkComposed } from '../link/Link';


const navItems = [
  { title: 'Company', path: '#company' },
  { title: 'About us', path: '#about' },
  { title: 'Stores', path: '#stores' },
  // Add other navigation items here
];

export default function LandingNavbar() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          top: 0,
          px: 2,
          py: 2,
          zIndex: 10000,
          backgroundColor: 'background.body',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
        }}
      >
        {/* Logo and Title */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <IconButton
            component={NextLinkComposed}
            to={{ pathname: '/' }}
            size="sm"
            variant="soft"
            color="success"
          >
            <RecyclingIcon />
          </IconButton>
          <Typography level="title-lg">
            Sustainabox
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box component="nav" sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            <Link
              key={item.title}
              component={NextLinkComposed}
              to={{
                pathname: '/',
                hash: item.path,
              }}
              level="title-md">
              {item.title}
            </Link>
          ))}
        </Box>

        {/* Authentication Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={NextLinkComposed}
            to={{
              pathname: '/login',
            }}
            variant="outlined"
          >
            Log in
          </Button>
          <Button
            component={NextLinkComposed}
            to={{
              pathname: '/signup',
            }}
            variant="solid">
            Get started
          </Button>
          <Button
            component={NextLinkComposed}
            to={{
              pathname: '/signup/supplier',
            }}
            variant="soft">
            Get started as a Supplier
          </Button>
        </Box>
      </Box>
    </Container>
  );
}