import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { Box, IconButton, Link, Sheet, Table, Typography } from "@mui/joy";
import Head from "next/head";
import React from "react";

import RatingDialog from "@/components/ui/RatingDialog";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const getServerSideProps = async () => {
    
    const orderRes = await fetch(`${process.env.BACKEND_URL}/api/orders`);
    const orders = await orderRes.json();

    const boxRes = await fetch(`${process.env.BACKEND_URL}/api/abobox`);
    const boxes = await boxRes.json();

    const feedbackRes = await fetch(`${process.env.BACKEND_URL}/api/feedback`);
    const feedback = await feedbackRes.json();
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    return { props: { orders, boxes, feedback, backendUrl } }
};

const createData = (order: any, boxes: any) => {
    return {
        orderId: order._id,
        userId: order.userId,
        orderDate: order.orderDate,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        type: order.type,
        // orderStatus: ['pending', 'completed', 'cancelled']
        orderStatus: order.orderStatus,
        items: order.items.map((item: any) => {
            const box = boxes.find((box: any) => box._id === item.aboBoxId);
            return {
                // subscriptionStatus: ['pending', 'active', 'expired', 'cancelled']
                ...item,
                name: box.boxType,
                size: box.size,
            }
        })
    };
};

const Row = (props: { order: ReturnType<typeof createData>; feedback: any[], initialOpen?: boolean, backendUrl:any }) => {
    const router = useRouter()

    const { order, feedback } = props;
    const userId = order.userId;
    
    const [open, setOpen] = React.useState(props.initialOpen || false);
    const [selectedItemForFeedback, setSelectedItemForFeedback] = React.useState<number | null>(null);

    const calculateTotal = (items: any) => {
        return items.reduce((acc: any, item: any) => acc + (item.quantity * item.orderPrice), 0).toFixed(2);
    }

    const formatDate = (dateString: any) => {
        const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    const openFeedbackModal = (index: number) => {
        setSelectedItemForFeedback(index);
    };

    const closeFeedbackModal = () => {
        setSelectedItemForFeedback(null);
    };

    const hasProvidedFeedback = (aboBoxId: string) => {
        // Filter the feedback for the current user and the specific AboBox ID
        const userFeedback = feedback.filter(fb => fb.userId === userId && fb.aboBoxId === aboBoxId);
        return userFeedback.length > 0;
    };

    const submitFeedback = async (feedback: any, backendUrl:any) => {
        const res = await fetch(`${backendUrl}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
        });
    
        if (res.status === 201) {
            router.reload();
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <tr>
                <td>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.deliveryAddress}</td>
                <td>{order.type}</td>
                <td>{order.orderStatus}</td>
                <td>€ {calculateTotal(order.items)}</td>
            </tr>
            <tr>
                <td style={{ padding: 0 }} colSpan={8}>
                    {open && (
                        <Sheet
                            variant="soft"
                            sx={{ p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}
                        >
                            <Typography level="body-lg" component="div">

                                Item Details
                            </Typography>
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="purchases"
                                sx={{
                                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                                        { textAlign: 'right' },
                                    '--TableCell-paddingX': '0.5rem',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>AboBox Name</th>
                                        <th>Size</th>
                                        <th>Quantity</th>
                                        <th>Order Price</th>
                                        <th>Subscription Months</th>
                                        <th>Subscription Status</th>
                                        <th>Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item: any, index: any) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.size}</td>
                                            <td>{item.quantity}</td>
                                            <td>€ {item.orderPrice}</td>
                                            <td>{item.subscription_months}</td>
                                            <td>{item.subscriptionStatus}</td>
                                            <td>€ {(item.quantity * item.orderPrice).toFixed(2)}</td>
                                            <td>
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    {order.orderStatus === 'completed' && !hasProvidedFeedback(item.aboBoxId) ? (
                                                        <Link
                                                            component="button"
                                                            onClick={() => openFeedbackModal(index)}
                                                            level="title-sm"
                                                        >
                                                            Feedback
                                                        </Link>
                                                    ) : (
                                                        <Link level="title-sm" disabled>Feedback</Link>
                                                    )}
                                                </Box>
                                                {selectedItemForFeedback === index && (
                                                    <RatingDialog
                                                        order={{
                                                            userId,
                                                            ...item
                                                        }}
                                                        open={selectedItemForFeedback === index}
                                                        setOpen={closeFeedbackModal}
                                                        submitFeedback={(feedback: any) => submitFeedback(feedback, props.backendUrl)}
                                                    />
                                                )}
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>
        </>
    );
};

const OrdersPage: NextPageWithLayout = ({ orders, boxes, feedback, backendUrl }: any) => {
    const { data: session, status } = useSession();
    const user: any = session?.user;
    // get only orders from user id
    orders = orders.filter((order: any) => order.userId === user._id);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Sheet variant="outlined"
            sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}>
            <Table aria-label="collapsible table"
                sx={{
                    '& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)':
                        { textAlign: 'right' },
                    '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                    {
                        borderBottom: 0,
                    },
                }}
            >
                <thead>
                    <tr>
                        <th style={{ width: 40 }} aria-label="empty" />
                        <th>Order Date</th>
                        <th>Payment Method</th>
                        <th>Delivery Address</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: any, index: number) => (
                        <Row key={order._id} order={createData(order, boxes)} feedback={feedback} initialOpen={index === 0} backendUrl={backendUrl} />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    )
};

OrdersPage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <>
            <Head>
                <title>My Orders</title>
            </Head>
            <DashboardLayout pageTitle="My Orders">{page}</DashboardLayout>
        </>
    );
};

export default OrdersPage;