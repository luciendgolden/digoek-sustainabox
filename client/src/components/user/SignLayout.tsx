import { Box, CssBaseline, GlobalStyles, IconButton, Typography } from '@mui/joy';
import { formLabelClasses } from '@mui/material/FormLabel';
import { NextLinkComposed } from '../link/Link';

import RecyclingIcon from '@mui/icons-material/Recycling';

const SignLayout = ({ children, backgroundImage }: { children: any, backgroundImage: any }) => {
    return (
        <>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Collapsed-breakpoint': '769px',
                        '--Cover-width': '50vw',
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': 'none',
                    },
                }}
            />
            <Box
                sx={{
                    width: 'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: 'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
                        maxWidth: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                        }}
                    >
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
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 500,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .${formLabelClasses.asterisk}`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        {/* Dynamic Content */}
                        {children}
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © Sustainabox {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${backgroundImage})`,
                    '@media (max-width: 769px)': {
                        backgroundImage: 'none',
                        backgroundColor: 'rgba(255 255 255 / 0.2)',
                    },
                }}
            />
        </>
    );
};

export default SignLayout;
