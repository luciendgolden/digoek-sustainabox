import React, { ReactElement } from 'react';
import Head from "next/head";
import RootLayout from '@/components/app/RootLayout';
import { NextPageWithLayout } from '@/pages/_app';
import SignLayout from '@/components/user/SignLayout';
import { useRouter } from 'next/router';
import PersonalInfoForm from "@/components/user/registration/PersonalInfoForm";
import { Box, Button, Step, StepIndicator, Stepper } from "@mui/joy";
import { Check, Description } from "@mui/icons-material";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import ConfirmationSupplier from '@/components/user/registration/ConfirmationSupplier';

const steps = ['Personal','Confirmation'];

export const getServerSideProps = (async (context: any) => {
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    return {
        props : {
            backendUrl
        }
    }
});

const SignupSupplierPage: NextPageWithLayout = ({backendUrl}:any ) => {
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
    });

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
                return <ConfirmationSupplier
                    formData={formData}
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
            preferences: [],
            role: {type:"supplier",description:"Supplier providing products to the platform."}
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
                router.push('/login');
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
}; 

SignupSupplierPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>Signup Page</title>
            </Head>
            <RootLayout>{page}</RootLayout>
        </>
    );
};

export default SignupSupplierPage;