import { Box, Button, Divider, FormControl, FormLabel, Input, Stack, Typography } from "@mui/joy";

const ConfirmationSupplier = (
    { formData }: any
) => {
    return (
        <Stack gap={1} sx={{ mt: 4 }}>
            <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={formData.firstName} disabled />
            </FormControl>

            <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={formData.lastName} disabled />
            </FormControl>

            <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={formData.email} disabled />
            </FormControl> 

            <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={formData.password} disabled />
            </FormControl>
        </Stack>
    );
}

export default ConfirmationSupplier;