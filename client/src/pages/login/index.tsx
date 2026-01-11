import RootLayout from '@/components/app/RootLayout';
import SignLayout from '@/components/user/SignLayout';
import { Box, Button, Checkbox, FormControl, FormLabel, Input, Link, Stack, Typography } from '@mui/joy';
import { getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { NextLinkComposed } from '@/components/link/Link';

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

// When user authenticated redirect to dashboard
export const getServerSideProps = (async (context: any) => {
    const session = await getServerSession(context.req, context.res, authOptions)

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

const LoginPage: NextPageWithLayout = ({ session }: any) => {
    const handleSubmit = async (event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const formData = {
            email: formElements.email.value,
            password: formElements.password.value,
            // persistent: formElements.persistent.checked,
        };

        await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            callbackUrl: '/dashboard',
        });
    };

    return (
        <SignLayout backgroundImage="/IMG_1185.WEBP">
            <Stack gap={4} sx={{ mb: 2 }}>
                <Stack gap={1}>
                    <Typography level="h3">Sign in</Typography>
                    <Typography level="body-sm">
                        New to company?{' '}
                            <Link
                                component={NextLinkComposed}
                                to={{
                                    pathname: '/signup',
                                }}
                                level="title-md"
                            >
                                Sign up!
                            </Link>
                    </Typography>
                </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
                <form onSubmit={handleSubmit}>
                    <FormControl required>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" name="email" />
                    </FormControl>
                    <FormControl required>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" name="password" />
                    </FormControl>
                    <Stack gap={4} sx={{ mt: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox size="sm" label="Remember me" name="persistent" disabled />
                            <Link level="title-sm" href="#replace-with-a-link">
                                Forgot your password?
                            </Link>
                        </Box>
                        <Button type="submit" fullWidth>
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </SignLayout>
    );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>Login Page</title>
            </Head>
            <RootLayout>{page}</RootLayout>
        </>
    );
};

export default LoginPage;