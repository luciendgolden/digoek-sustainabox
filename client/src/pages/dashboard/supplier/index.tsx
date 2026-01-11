import Loading from '@/components/app/Loading';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Button, Chip, DialogContent, DialogTitle, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog, Select, Sheet, Stack, Typography } from '@mui/joy';
import { signOut, useSession } from "next-auth/react";
import Head from 'next/head';
import { type ReactElement } from 'react';
import { NextPageWithLayout } from '../../_app';
import ProductTable from '@/components/ui/ProductTable';
import ProductList from '@/components/ui/ProductList';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import React from 'react';
import Option from '@mui/joy/Option';

interface Product {
    _id: string;
    name: string;
    description: string;
    productPrice: number;
    stockLevel: number;
    categories: {
      _id: string;
      type: string;
      description: string;
      seoTag: string;
    }[];
    supplierId: string;
  }


  export const getServerSideProps = (async (context: any) => {
    // Fetch data from external API
    const session: any = await getServerSession(context.req, context.res, authOptions)
    const supplierId = session?.user?._id;
    
    const res = await fetch(`${process.env.BACKEND_URL}/api/supplier/${supplierId}`)
    const products: Product[] = await res.json()
    const backendUrl = process.env.BACKEND_URL_BROWSER;
    // Pass data to the page via props
    return { props: { products, backendUrl } }
  })

const SupplierDashboardPage: NextPageWithLayout = ({products, backendUrl}:any) => {
    const { data: session, status }: any = useSession();
    
    const [open, setOpen] = React.useState<boolean>(false);
    
    const supplierId = session?.user?._id;
    console.log("Supplier ID: ", supplierId)

    
    return (
        <Box>
            <Box sx={{ display: 'flex',  alignItems: 'center' }}>
                <Button variant="outlined" onClick={() => setOpen(true)}>
                    Add Product
                </Button>
            </Box>
            
            <ProductTable products={products} backendUrl={backendUrl}/>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Add a new Product</DialogTitle>
                    <DialogContent>Fill in the information of the Product.</DialogContent>
                    <form
                        onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        // send form data to API
                        let myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        console.log(event.currentTarget)
                        let raw = JSON.stringify({
                            "name": (event.currentTarget[0] as HTMLInputElement).value,
                            "description": (event.currentTarget[1] as HTMLInputElement).value,
                            "productPrice": Number((event.currentTarget[2] as HTMLInputElement).value),
                            "stockLevel": Number((event.currentTarget[3] as HTMLInputElement).value),
                            "categories": JSON.parse((event.currentTarget[5] as HTMLInputElement).value),
                            "supplierId": supplierId
                        });
                        
                        const res = await fetch(`${backendUrl}/api/products/`, {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                          })
                        const resJson = await res.json();
                        if (res.ok && resJson) {
                            //refresh page
                            window.location.reload();
                        }
                        }}

                    >
                        <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input autoFocus required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Stock Level</FormLabel>
                            <Input required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Categories</FormLabel>
                            <Select
                                multiple
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                                    {selected.map((selectedOption,index) => (
                                        <Chip key={index} variant="soft" color="primary">
                                        {selectedOption.label}
                                        </Chip>
                                    ))}
                                    </Box>
                                )}
                                sx={{
                                    minWidth: '15rem',
                                }}
                                slotProps={{
                                    listbox: {
                                    sx: {
                                        width: '100%',
                                    },
                                    },
                                }}
                                >
                                <Option key="658062a7e98f20fa5d1095df" value="658062a7e98f20fa5d1095df">Sustainable Household Goods</Option>
                                <Option key="658062a7e98f20fa5d1095e0" value="658062a7e98f20fa5d1095e0">Zero-Waste Products</Option>
                                <Option key="658062a7e98f20fa5d1095e1" value="658062a7e98f20fa5d1095e1">Organic Foods</Option>
                                <Option key="658062a7e98f20fa5d1095e2" value="658062a7e98f20fa5d1095e2">Eco-friendly Fashion</Option>
                            </Select>
                        </FormControl>
                        <Button type="submit" >Submit</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Box>
        
    );
};

SupplierDashboardPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Head>
                <title>Supplier Dashboard Page</title>
            </Head>
            <DashboardLayout pageTitle="Supplier Dashboard">{page}</DashboardLayout>;
        </>
    );
};

export default SupplierDashboardPage;

