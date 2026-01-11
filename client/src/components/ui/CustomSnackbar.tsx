import React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Button } from '@mui/joy';

const CustomSnackbar = ({
    open,
    setOpen,
    message,
    color = 'primary', // default color
    duration = 3000, // default duration
    anchorOrigin={ vertical: 'bottom', horizontal: 'right' },
}: {
    open: boolean,
    setOpen: any,
    message: string,
    color?: any, // "primary" | "danger" | "neutral" | "success" | "warning",
    duration?: number,
    anchorOrigin?: any,
}) => {
    return (
        <Snackbar
            autoHideDuration={duration}
            open={open}
            variant='soft'
            color={color} // using the color prop
            onClose={() => setOpen(false)}
            anchorOrigin={anchorOrigin}
            startDecorator={<InfoOutlined />}
            endDecorator={
                <Button
                    onClick={() => setOpen(false)}
                    size="sm"
                    variant="soft"
                    color={color} // using the color prop for the button as well
                >
                    Dismiss
                </Button>
            }
        >
            {message}
        </Snackbar>
    )
}

export default CustomSnackbar;