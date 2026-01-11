
import React from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { AspectRatio, Box, Button, Card, CardActions, CardOverflow, Chip, Divider, FormControl, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";

import CustomSnackbar from "@/components/ui/CustomSnackbar";
import Rating from "@/components/ui/Rating";
import Image from "next/image";
import { useRouter } from "next/router";

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';

export const getServerSideProps = (async (context: any) => {
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    return {
        props : {
            backendUrl
        }
    }
});

const UserDashboardProfilePage: NextPageWithLayout = ({backendUrl}:any) => {
    const router = useRouter();

    const { data: session, status } = useSession();
    const userInfo: any = session?.user;

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');
    const [snackBarColor, setSnackBarColor] = React.useState('primary');

    const [originalPreferences, setOriginalPreferences] = React.useState<any[]>([]);
    const [preferences, setPreferences] = React.useState<any[]>(userInfo?.preferences || []);

    React.useEffect(() => {
        if (userInfo?.preferences) {
            setPreferences(userInfo.preferences);
            setOriginalPreferences(userInfo.preferences);
        }
    }, [userInfo?.preferences]);
    
    
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    const showSnackbar = (message: string, color: string) => {
        setSnackBarMessage(message);
        setSnackBarColor(color);
        setSnackbarOpen(true);
    }

    const handleRatingChange = (categoryId: string, newValue: number) => {
        setPreferences(prevPreferences =>
            prevPreferences.map(preference => {
                if (preference.category._id === categoryId) {
                    return { ...preference, preferenceLevel: newValue };
                }
                return preference;
            })
        );
    };

    const handleSubmit = async () => {
        const updatedPreferences = preferences.map(pref => {
            const originalPref = originalPreferences.find(original => original.category._id === pref.category._id);
            
            return {
                categoryId: pref.category._id,
                preferenceLevel: pref.preferenceLevel,
                source: originalPref && originalPref.preferenceLevel !== pref.preferenceLevel ? 'user' : pref.source,
            };
        });

        try{
            const response = await fetch(`${backendUrl}/api/users/preferences/${userInfo._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPreferences),
            });

            if (response.ok) {
                showSnackbar('Preferences updated successfully', 'success');
                // wait before reloading the page
                setTimeout(async () => await signOut({ callbackUrl: '/' }), 3000);
            }
        }catch(error){
            console.log(error);
            showSnackbar('Failed to update preferences', 'danger');
            setTimeout(() => router.reload(), 3000);
        }
    };

    const handleCancle = () => {
        setPreferences([...originalPreferences]);
        showSnackbar('Changes discarded', 'warning');
    }

    return (
        <Stack
            spacing={4}
            sx={{
                display: 'flex',
                minWidth: {
                    xs: '100%',
                    md: '80%',
                    lg: '50%',
                },
                mx: 'auto',
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 3 },
            }}
        >
            <Card>
                <Box sx={{ mb: 1 }}>
                    <Typography level="title-md">Personal info</Typography>
                    <Typography level="body-sm">
                        Customize how your profile information will apper to the networks.
                    </Typography>
                </Box>
                <Divider />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1
                }}>
                    <Chip
                        color={userInfo.subscriptionStatus ? 'success' : 'danger'}
                        disabled={false}
                        size="md"
                    >
                        {userInfo.subscriptionStatus ? 'Active' : 'Inactive'}
                    </Chip>
                </Box>

                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ display: 'flex', my: 1 }}
                >
                    <Stack direction="row" spacing={2}>
                        <Stack direction="column" spacing={1}>
                            <AspectRatio
                                ratio="1"
                                maxHeight={108}
                                sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                            >
                                <Image
                                    src="/avatar.png"
                                    alt="Avatar"
                                    width={200}
                                    height={200}
                                    priority={true}
                                />
                            </AspectRatio>
                        </Stack>
                        <Stack spacing={1} sx={{
                            flexGrow: 1
                        }}>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input size="sm" placeholder="First name" defaultValue={userInfo.firstName} disabled />
                            </FormControl>
                            <FormControl>
                                <Input size="sm" placeholder="Last name" defaultValue={userInfo.lastName} disabled />
                            </FormControl>
                        </Stack>
                    </Stack>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                        <Input size="sm" defaultValue={userInfo.role.type} disabled />
                    </FormControl>
                    <FormControl>
                        <Input size="sm" defaultValue={userInfo.role.description} disabled />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            size="sm"
                            type="email"
                            startDecorator={<EmailRoundedIcon />}
                            placeholder="email"
                            defaultValue={userInfo.email}
                            sx={{ flexGrow: 1 }}
                            disabled
                        />
                    </FormControl>
                    <div>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={1}
                            sx={{ mt: 2 }}
                        >
                            {preferences.map((preference: any) => (
                                <Stack key={preference.category._id}>
                                    <Typography component="legend">{preference.category.type}</Typography>
                                    <Rating
                                        name={`preference-${preference.category._id}`}
                                        value={preference.preferenceLevel || 0}
                                        onChange={(event, newValue) => handleRatingChange(preference.category._id, newValue)}
                                    />
                                </Stack>
                            ))}
                        </Stack>
                    </div>
                </Stack>

                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                    <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                        <IconButton size="sm" variant="outlined" color="neutral" onClick={handleCancle}>
                            <ReplayRoundedIcon/>
                        </IconButton>
                        <Button size="sm" variant="solid" onClick={handleSubmit}>
                            Save
                        </Button>
                    </CardActions>
                </CardOverflow>
            </Card>

            <CustomSnackbar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={snackBarMessage}
                color={snackBarColor}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Stack>
    );
};

UserDashboardProfilePage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <>
            <Head>
                <title>My profile</title>
            </Head>
            <DashboardLayout pageTitle="My profile">{page}</DashboardLayout>;
        </>
    );
};

export default UserDashboardProfilePage;