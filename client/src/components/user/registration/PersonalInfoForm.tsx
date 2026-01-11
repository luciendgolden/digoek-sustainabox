import { Key } from "@mui/icons-material";
import { Box, Button, FormControl, FormLabel, Input, LinearProgress, Stack, Typography } from "@mui/joy";
import React, { FormEvent } from "react";

const PW_MIN_LENGTH = 12;

const PersonalInfoForm = (
    { formData, setFormData, handleNext}: {
        formData: any,
        setFormData: any,
        handleNext: any,
    }
) => {

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleNext();
    }

    // Update state on input change
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
                </FormControl>

                {/* Last Name */}
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </FormControl>

                {/* Email */}
                <FormControl>
                    <FormLabel>Your email</FormLabel>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </FormControl>

                {/* Password */}
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Stack
                        spacing={0.5}
                        sx={{
                            '--hue': Math.min(formData.password.length * 10, 120),
                        }}
                    >
                        <Input
                            type="password"
                            name="password"
                            placeholder="Type in here…"
                            startDecorator={<Key />}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <LinearProgress
                            determinate
                            size="sm"
                            value={Math.min((formData.password.length * 100) / PW_MIN_LENGTH, 100)}
                            sx={{
                                bgcolor: 'background.level3',
                                color: 'hsl(var(--hue) 80% 40%)',
                            }}
                        />
                        <Typography
                            level="body-xs"
                            sx={{ alignSelf: 'flex-end', color: 'hsl(var(--hue) 80% 30%)' }}
                        >
                            {formData.password.length < 3 && 'Very weak'}
                            {formData.password.length >= 3 && formData.password.length < 6 && 'Weak'}
                            {formData.password.length >= 6 && formData.password.length < 10 && 'Strong'}
                            {formData.password.length >= 10 && 'Very strong'}
                        </Typography>
                    </Stack>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant='soft' disabled>Prev</Button>
                    <Button variant='solid' type="submit">Next</Button>
                </Box>
            </form>
        </Box>
    );
};

export default PersonalInfoForm