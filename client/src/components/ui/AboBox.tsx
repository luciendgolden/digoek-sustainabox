import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import { AspectRatio, Box, Button, Card, CardContent, IconButton, LinearProgress, Typography } from "@mui/joy";
import Image from 'next/image';

const AboBox = ({ ...props }: any) => {
    const handleAddToCart = () => {
        props.addToCart(props.item);
    };

    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
        }}
        >
            <div>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography level="title-lg">{props.item.boxType} - {props.item.size}</Typography>
                    {/* Add more details as needed */}
                    <IconButton
                        onClick={handleAddToCart}
                        aria-label={`add ${props.item.boxType}`}
                        variant="plain"
                        color="neutral"
                        size="sm"
                    >
                        <AddShoppingCartRoundedIcon />
                    </IconButton>
                </Box>
            </div>
            <AspectRatio minHeight="120px" maxHeight="200px">
                <Image
                    src={props.item.imageUrl}
                    alt={props.item.boxType}
                    style={{ objectFit: 'cover' }}
                    priority={true}
                    width={500}
                    height={500}
                />
            </AspectRatio>
            <CardContent sx={{ mt: 'auto' }}>
                <CardContent orientation="horizontal">
                    <div>
                        <Typography level="body-xs">Total price:</Typography>
                        <Typography fontSize="lg" fontWeight="lg">
                            € {props.item.price}
                        </Typography>
                    </div>
                    {/* TODO: Show Modal with details about the box and the respective rating */}
                    <Button
                        variant="solid"
                        size="md"
                        color="primary"
                        aria-label={`Explore ${props.item.boxType}`}
                        sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 600 }}
                    >
                        Explore
                    </Button>
                </CardContent>
                <CardContent orientation="horizontal">
                    <Typography level="body-xs">
                        Likelihood you&apos;ll love this: {props.item.weightPercentage.toFixed(0)}%
                    </Typography>
                    <Box sx={{ width: '100%', my: 1 }}> {/* Adjust margin as needed */}
                        <LinearProgress determinate value={props.item.weightPercentage} />
                    </Box>
                </CardContent>
            </CardContent>
        </Card>
    );
}

export default AboBox;