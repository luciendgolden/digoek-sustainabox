import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AboBox from '@/components/ui/AboBox';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Box, Button, Card, Chip, Container, Grid, IconButton, Stack, Typography } from '@mui/joy';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useState, type ReactElement } from 'react';
import { NextPageWithLayout } from '../../_app';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import OrderModal from '@/components/order/OrderModal';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Loading from '@/components/app/Loading';
import RootLayout from '@/components/app/RootLayout';


// When user authenticated redirect to dashboard
export const getServerSideProps = (async (context: any) => {
    const session: any = await getServerSession(context.req, context.res, authOptions)
    const resBox = await fetch(`${process.env.BACKEND_URL}/api/users/abobox/${session?.user?._id}`);
    const recommendedBoxes = await resBox.json();
    
    return {
        props: {
            boxes: recommendedBoxes.recommended_boxes ?? [],
        },
    }
});

// based on the categories within the box generate some image url's
const imageUrls: any = {
    'Zero-Waste Starter Kit': '/Zero-Waste.png',
    'Eco-Friendly Fashion': '/Fashion.png',
    'Organic Gourmet': '/Organic.png',
    'Sustainable Household Essentials': '/Household.png',
}


const UserDashboardPage: NextPageWithLayout = ({ boxes }: any) => {
    const { data: session, status } = useSession();

    const [cart, setCart] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        console.log(cart);
    }, [cart]);

    // Calculate the total weight of all AboBoxes
    const totalWeight = boxes.reduce((total: any, abobox: any) => total + abobox.weight, 0);

    // Calculate the weight percentage for each AboBox
    const modifiedBoxes = boxes.map((abobox: any) => {
        const weightPercentage = (abobox.weight / totalWeight) * 100;
        const imageUrl = imageUrls[abobox.boxType];
        return { ...abobox, weightPercentage, imageUrl };
    });

    modifiedBoxes.sort((a: any, b: any) => b.weightPercentage - a.weightPercentage);

    // get total cart items
    const totalItems = cart.reduce((acc: any, item: any) => acc + item.quantity, 0);

    const addToCart = (item: any) => {
        // Check if item is already in cart
        const existingItem = cart.find((cartItem: any) => cartItem.aboBoxId === item._id);

        if (existingItem) {
            const updatedCart = cart.map((cartItem: any) =>
                cartItem.aboBoxId === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            setCart(updatedCart);
            return;
        }

        // If item is not in cart yet, add it
        const newCartItem = {
            aboBoxId: item._id,
            imageUrl: item.imageUrl,
            name: item.boxType,
            size: item.size,
            quantity: 1, // default quantity
            orderPrice: item.price,
            subscriptionMonths: 6, // default subscription period
        };
        setCart([...cart, newCartItem]);
    };

    const proceedOrder = async (orderData: any) => {
        console.log('Order proceed:', orderData);

        router.push({
            pathname: `${pathname}/orders/submit`,
            query: { orderData: JSON.stringify(orderData) }
        }, `${pathname}/orders/submit`);
    };

    return (
        <Stack direction="column" spacing={2}>
            <Box
                sx={{
                    display: 'flex',
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                }}
            >

                <IconButton
                    color="primary"
                    size="sm"
                    disabled
                >
                    <ShoppingCartRoundedIcon />
                    <Chip
                        size="sm"
                        color="danger"
                        variant="solid"
                    >
                        {totalItems}
                    </Chip>
                </IconButton>

                <Button
                    color="primary"
                    startDecorator={<HomeRoundedIcon />}
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                >
                    Order Now
                </Button>
            </Box>

            <Box sx={{ width: '100%' }}>
            <Container fixed>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ flexGrow: 1 }}
            >
                    {modifiedBoxes.map((item: any, index: number) => (
                        <Grid xs={2} sm={4} md={4} key={index}>
                        <AboBox
                            key={item._id}
                            item={item}
                            addToCart={addToCart}
                        />
                        </Grid>
                    ))}
            </Grid>
            </Container>
            </Box>

            <OrderModal
                user={session?.user}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cart={cart}
                setCart={setCart}
                type="aboBox"
                submitOrder={proceedOrder}
            />
        </Stack>
    );
};

UserDashboardPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>User Dashboard Page</title>
            </Head>
            <DashboardLayout pageTitle="Dashboard">{page}</DashboardLayout>
        </>
    );
};

export default UserDashboardPage;

