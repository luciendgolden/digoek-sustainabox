import RootLayout from "@/components/app/RootLayout";
import SignLayout from "@/components/user/SignLayout";
import Confirmation from "@/components/user/registration/Confirmation";
import PersonalInfoForm from "@/components/user/registration/PersonalInfoForm";
import PreferencesForm from "@/components/user/registration/PreferencesForm";
import { Category } from "@/lib/types";
import { Check } from "@mui/icons-material";
import { Box, Button, Step, StepIndicator, Stepper } from "@mui/joy";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const steps = ['Personal', 'Preferences', 'Confirmation'];

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
    
    // fetch categories from backend
    const res = await fetch(`${process.env.BACKEND_URL}/api/categories`);
    const categories: Category[] = await res.json();
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    return {
        props: {
            categories,
            backendUrl
        }
    }
});

const SignupPage: NextPageWithLayout = ({ categories,backendUrl }: any) => {
    const router = useRouter();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');
    const [snackBarColor, setSnackBarColor] = React.useState('primary');

    const [currentStep, setCurrentStep] = React.useState(0);

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        preferences: [],
    });

    /*
    React.useEffect(() => {
        console.log("FormData Updated:", formData);
    }, [formData]);
    */

    // Initialize preferences in formData when categories are received
    React.useEffect(() => {
        const initialPreferences = categories.map((category: any) => ({
            categoryId: category._id,
            preferenceLevel: 0,
            source: "registration",
        }));
        setFormData((currentFormData: any) => ({ ...currentFormData, preferences: initialPreferences }));
    }, [categories, setFormData]);


    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <PersonalInfoForm
                    formData={formData}
                    setFormData={setFormData}
                    handleNext={handleNext}
                />
            case 1:
                return <PreferencesForm
                    categories={categories}
                    formData={formData}
                    setFormData={setFormData}
                    handleNext={handleNext}
                    handleBack={handleBack}
                />;
            case 2:
                return <Confirmation
                    formData={formData}
                    categories={categories}
                />;
            default:
                return <div>Unknown step</div>;
        }
    };

    const transformData = (sourceData: any) => {
        return {
            email: sourceData.email,
            password: sourceData.password,
            firstName: sourceData.firstName,
            lastName: sourceData.lastName,
            subscriptionStatus: false, // default or computed value
            referredBy: null, // default value
            preferences: sourceData.preferences,
        };
    };

    const handleRegistration = async (event: any) => {
        event.preventDefault();
        console.log(formData);

        const transformedData = transformData(formData);

        try {
            // TODO: Validate data before sending to backend
            // TODO: Encrypt password before sending to backend
            // Send formData to backend
            const res = await fetch(`${backendUrl}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedData),
            });

            if (res.ok) {
                showSnackbar('Registration successful', 'success');
                await setTimeout(() => router.push('/login'), 3000);
            } else {
                showSnackbar(`Registration failed`, 'danger');
                // wait 3 seconds before reloading the page
                await setTimeout(() => router.reload(), 3000);
            }

        } catch (error) {
            console.error('Error registering user', error);
            showSnackbar('Error registering user', 'danger');
            // wait 3 seconds before reloading the page
            await setTimeout(() => router.reload(), 3000);
        }
    }

    const showSnackbar = (message: string, color: string) => {
        setSnackBarMessage(message);
        setSnackBarColor(color);
        setSnackbarOpen(true);
    }

    return (
        <SignLayout backgroundImage='/IMG_1185.WEBP'>
            {/* Main content */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
                <Box sx={{ width: '100%', m: 2 }}>
                    {/* Stepper */}
                    <Stepper>
                        {steps.map((step, index) => (
                            <Step
                                key={step}
                                orientation='vertical'
                                indicator={
                                    <StepIndicator
                                        variant={currentStep <= index ? 'soft' : 'solid'}
                                        color={currentStep < index ? 'neutral' : 'primary'}
                                    >
                                        {currentStep > index ? <Check /> : index + 1}
                                    </StepIndicator>
                                }
                            >
                                {step}
                            </Step>
                        ))}
                    </Stepper>

                    {/* Dynamic Step Content */}
                    {getStepContent(currentStep)}

                    {/* Steps Navigation */}
                    {
                        // Show the Register button on the last step
                        currentStep === steps.length - 1 && (
                            <>
                                <Box sx={{ display: 'flex', mt: 2 }}>
                                    <Button variant='solid' onClick={handleRegistration} fullWidth>Register</Button>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button variant='soft' onClick={handleBack}>Prev</Button>
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Box>

            <CustomSnackbar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={snackBarMessage}
                color={snackBarColor}
            />

        </SignLayout >
    );
}

SignupPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>Signup Page</title>
            </Head>
            <RootLayout>{page}</RootLayout>
        </>
    );
};

export default SignupPage;