import Rating from "@/components/ui/Rating";
import { Category } from "@/lib/types";
import { Box, Button, Divider, FormControl, FormLabel, Input, Stack, Typography } from "@mui/joy";

const Confirmation = (
    { formData, categories }: any
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

            <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mt: 2 }}
                >
                    {categories.map((category: Category) => (
                        <Stack key={category._id} >
                            <Typography component="legend">{category.type}</Typography>
                            <Rating
                                name={`preference-${category._id}`}
                                value={formData.preferences.find((p: any) => p.categoryId === category._id)?.preferenceLevel || 0}
                                disabled
                            />
                        </Stack>
                    ))}
                </Stack>
        </Stack>
    );
}

export default Confirmation;