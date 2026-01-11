import Rating from "@/components/ui/Rating";
import { Category } from "@/lib/types";
import { Box, Button, Divider, Stack, Typography } from "@mui/joy";
import React, { FormEvent } from "react";
import Snackbar from '@mui/joy/Snackbar';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CustomSnackbar from "@/components/ui/CustomSnackbar";


const PreferencesForm = (
    { categories, formData, setFormData, handleNext, handleBack }: {
        categories: Category[],
        formData: any,
        setFormData: any,
        handleNext: any,
        handleBack: any,
    }
) => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const allPreferencesValid = formData.preferences.every((pref: any) => pref.preferenceLevel > 0);
        if (allPreferencesValid) {
            handleNext();
        } else {
            setSnackBarMessage('Please rate all categories before proceeding.');
            setSnackbarOpen(true);
        }
    }

    const handleChange = (categoryId: any) => (event: any, newValue: any) => {
        setFormData((currentFormData: any) => {
            const updatedPreferences = currentFormData.preferences.map((pref: any) =>
                pref.categoryId === categoryId ? { ...pref, preferenceLevel: newValue } : pref
            );
            return { ...currentFormData, preferences: updatedPreferences };
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <form onSubmit={handleSubmit}>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    {categories.map(category => (
                        <Stack key={category._id} sx={{ width: '100%' }} direction="row" justifyContent="space-between" alignItems="center" divider={<Divider orientation="vertical" />} spacing={2}>
                            <Box sx={{ width: 200 }}>
                                <Typography level="h4">{category.type}</Typography>
                            </Box>
                            <Rating
                                name={`preference-${category._id}`}
                                value={formData.preferences.find((p: any) => p.categoryId === category._id)?.preferenceLevel || 0}
                                onChange={handleChange(category._id)}
                            />
                        </Stack>
                    ))}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant='soft' onClick={handleBack} >Prev</Button>
                    <Button variant='solid' type='submit'>Next</Button>
                </Box>

                <CustomSnackbar
                    open={snackbarOpen}
                    setOpen={setSnackbarOpen}
                    message={snackBarMessage}
                    color="danger"
                />
            </form>
        </Box >
    )
};

export default PreferencesForm;