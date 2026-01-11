import React, { useState } from 'react';
import { AspectRatio, Avatar, Box, Button, Card, CardContent, Chip, DialogContent, DialogTitle, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemDecorator, ModalClose, Select, Typography } from '@mui/joy';
import Option from '@mui/joy/Option';
import Image from 'next/image';

import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

const OrderModal = ({ user, open, onClose, cart, setCart, type, submitOrder }: any) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    // Update the quantity of an item in the cart
    const updateQuantity = (index: any, delta: any) => {
        const updatedCart = [...cart];
        const newQuantity = updatedCart[index].quantity + delta;
        if (newQuantity > 0) {
            updatedCart[index].quantity = newQuantity;
            setCart(updatedCart);
        } else {
            // Optional: Prompt the user before removing the item from the cart
            removeItemFromCart(index);
        }
    };

    // Remove an item from the cart
    const removeItemFromCart = (index: any) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
    };

    const calculateTotal = () => {
        return cart.reduce((acc: any, item: any) => acc + (item.quantity * item.orderPrice), 0).toFixed(2);
    };

    const handleSubscriptionChange = (event: any, newValue: any, aboBoxId: any) => {
        setCart((currentCart: any) =>
            currentCart.map((item: any) =>
                item.aboBoxId === aboBoxId
                    ? { ...item, subscriptionMonths: Number(newValue) }
                    : item
            )
        );
    };

    const handleSubmit = () => {
        const orderData = {
            userId: user._id, // get this from user session or context
            paymentMethod,
            deliveryAddress,
            type,
            items: cart,
        };
        submitOrder(orderData);
    };

    const imageStyle: any = {
        objectFit: 'contain',
        height: 'auto',
        borderRadius: '10%',
    }

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
        >
            <ModalClose />
            <DialogTitle>Cart</DialogTitle>
            <DialogContent>
                <Box role="presentation" sx={{ p: 2 }}>
                    <List>
                        {cart.map((item: any, index: any) => (
                            <ListItem key={item.aboBoxId}>
                                <Box sx={{
                                    display: 'flex', flexDirection: {
                                        xs: 'row',
                                        sm: 'column',
                                    },
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    width: '100%'
                                }}>
                                    <ListItemDecorator>
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={imageStyle}
                                            width={200}
                                            height={120}
                                            loading="lazy"
                                        />
                                    </ListItemDecorator>
                                    <Typography level="title-lg">{item.name}</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography level="title-md">Price: €{(item.orderPrice).toFixed(2)}</Typography>
                                        <Typography level="title-md">Total: €{(item.orderPrice * item.quantity).toFixed(2)}</Typography>
                                    </Box>
                                    <Select
                                        value={item.subscriptionMonths}
                                        defaultValue={item.subscriptionMonths}
                                        onChange={(event: any, newValue: any) => handleSubscriptionChange(event, newValue, item.aboBoxId)}
                                    >
                                        {
                                            [1, 3, 6, 12].map((month: any) => (
                                                <Option key={month} value={month}>
                                                    {month} month{month > 1 && 's'}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <IconButton size="sm" onClick={() => updateQuantity(index, -1)}>
                                            <RemoveCircleOutlineRoundedIcon />
                                        </IconButton>
                                        <Chip
                                            color="primary"
                                            variant="soft"
                                        >
                                            {item.quantity}
                                        </Chip>
                                        <IconButton size="sm" onClick={() => updateQuantity(index, 1)}>
                                            <AddCircleOutlineRoundedIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </DialogContent >
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 2,
                paddingY: 2,
                paddingX: 2,
            }}>
                <Typography level="title-md">Total: €{calculateTotal()}</Typography>
                <Button onClick={handleSubmit}>Proceed Order</Button>
            </Box>

            <Divider />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', paddingY: 2, pl: 2 }}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    src="/avatar.png"
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">{user.firstName} {user.lastName}</Typography>
                    <Typography level="body-xs" noWrap>{user.email}</Typography>
                </Box>
            </Box>
        </Drawer >
    );
}

export default OrderModal;