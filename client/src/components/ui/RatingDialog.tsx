import { Modal, ModalDialog, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Button, Textarea, Box, IconButton, Typography } from "@mui/joy";
import Rating from "@/components/ui/Rating";
import { useState } from "react";

const RatingDialog = (props: {
    order: any,
    open: boolean,
    setOpen: any,
    submitFeedback: any
}) => {
    const { order, open, setOpen, submitFeedback } = props;
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, newRating: number) => {
        setRating(newRating);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (rating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        submitFeedback({
            userId: order.userId,
            aboBoxId: order.aboBoxId,
            rating: rating,
            comment: comment
        });
        setOpen(false);
    }

    const addEmoji = (emoji: string) => () => setComment(`${comment}${emoji}`);

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog layout="center" size="lg">
                <DialogTitle>Give Feedback</DialogTitle>
                <DialogContent>{order.name} - {order.size}</DialogContent>
                <form
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Rating</FormLabel>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={handleRatingChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Comment</FormLabel>
                            <Textarea
                                placeholder="Type in here…"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                minRows={2}
                                maxRows={4}
                                startDecorator={
                                    <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
                                        <IconButton variant="outlined" color="neutral" onClick={addEmoji('👎')}>
                                            👎
                                        </IconButton>
                                        <IconButton variant="outlined" color="neutral" onClick={addEmoji('😐')}>
                                            😐
                                        </IconButton>
                                        <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                                            👍
                                        </IconButton>
                                        <IconButton variant="outlined" color="neutral" onClick={addEmoji('😍')}>
                                            😍
                                        </IconButton>
                                    </Box>
                                }
                                endDecorator={
                                    <Typography level="body-xs" sx={{ ml: 'auto' }}>
                                        {comment.length} character(s)
                                    </Typography>
                                }
                                sx={{ minWidth: 300 }}
                            />
                        </FormControl>
                        <Button type="submit" disabled={rating === 0}>Submit</Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    )
}

export default RatingDialog;