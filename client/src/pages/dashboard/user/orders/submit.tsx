import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Confetti from "@/components/ui/Confetti";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import { NextPageWithLayout } from "@/pages/_app";
import { Button, FormControl, FormLabel, Input, Sheet, Stack, Table } from "@mui/joy";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect } from "react";
export const getServerSideProps = (async (context: any) => {
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    return {
        props : {
            backendUrl
        }
    }
});
const SubmitPage: NextPageWithLayout = (props: any) => {
    const router = useRouter();
    const [orderData, setOrderData] = React.useState<any>();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState('');
    const [snackBarColor, setSnackBarColor] = React.useState('primary');

    const [isVisible, setIsVisible] = React.useState(false);

    useEffect(() => {
        if (router.query.orderData) {
            try {
                const parsedData = JSON.parse(router.query.orderData as string);
                setOrderData(parsedData);
            } catch (error) {
                console.error("Failed to parse order data:", error);
            }
        }
    }, [router.query.orderData]);


    if (!orderData) {
        return <>Nothing to submit..</>;
    }

    const showSnackbar = (message: string, color: string) => {
        setSnackBarMessage(message);
        setSnackBarColor(color);
        setSnackbarOpen(true);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setOrderData({
            ...orderData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const transformedOrderData = {
            ...orderData,
            items: orderData.items.map((item: any) => ({
                aboBoxId: item.aboBoxId,
                quantity: item.quantity,
                orderPrice: item.orderPrice,
                subscription_months: item.subscriptionMonths
            }))
        };

        try {
            const res = await fetch(`${props.backendUrl}/api/orders/boxes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transformedOrderData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            setIsVisible(true);
            showSnackbar('Order submitted successfully', 'success');
            await setTimeout(() => router.push('/dashboard/user/orders'), 3000);
        } catch (error) {
            console.error("Failed to submit order:", error);
            showSnackbar('Failed to submit order', 'danger');
        }
    };



    return (
        <React.Fragment>
            <Stack
                direction="column"
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                }}
                spacing={2}>
                <Sheet>
                    <Sheet>
                        <Table>
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Name</th>
                                    <th>Size</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                    <th>Subscription Months</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.items.map((item: any, index: any) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.size}</td>
                                        <td>{item.quantity}</td>
                                        <td>€{item.orderPrice.toFixed(2)}</td>
                                        <td>€{(item.quantity * item.orderPrice).toFixed(2)}</td>
                                        <td>{item.subscriptionMonths} months</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </Sheet>
                <form onSubmit={handleSubmit}>
                    <Stack gap={2} sx={{ mt: 4 }}>
                        <FormControl>
                            <FormLabel>Payment Method</FormLabel>
                            <Input placeholder="Payment Method"
                                name="paymentMethod"
                                onChange={handleInputChange}
                                value={orderData.paymentMethod || ''}
                                required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Delivery Address</FormLabel>
                            <Input
                                placeholder="Delivery Address"
                                name="deliveryAddress"
                                onChange={handleInputChange}
                                value={orderData.deliveryAddress || ''}
                                required />
                        </FormControl>
                        {/*submit button*/}
                        <Button type="submit">Proceed Order</Button>
                    </Stack>
                </form>
            </Stack>
            <CustomSnackbar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={snackBarMessage}
                color={snackBarColor}
            />

            {isVisible && <Confetti />}
        </React.Fragment>
    )
};

SubmitPage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <>
            <Head>
                <title>Submit Order</title>
            </Head>
            <DashboardLayout pageTitle="Submit Order">{page}</DashboardLayout>
        </>
    );
};

export default SubmitPage;