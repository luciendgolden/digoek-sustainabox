/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Table,
  Sheet,
  Checkbox,
  IconButton,
  Typography,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/material';
import Dropdown from '@mui/joy/Dropdown';
import { get } from 'http';
import { DialogContent, DialogTitle } from '@mui/joy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

interface Product {
  _id: string;
  name: string;
  stockLevel: number;
  supplierId: string;
  productPrice: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function RowMenu({ productId, supplierId, user, product, backendUrl }: { productId: string; supplierId: string; user:any; product: Product; backendUrl:any }) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem onClick={() => setOpen(true)}>Order Product</MenuItem>
          <Divider />
          <MenuItem color="danger">Delete (Not working)</MenuItem>
        </Menu>
        <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Order Product</DialogTitle>
          <DialogContent>
            <form
              onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                // send form data to API
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                console.log(event.currentTarget)
                const quantity = Number((event.currentTarget[0] as HTMLInputElement).value)
                let dateTime = new Date()
                let raw = JSON.stringify({
                  "userId": user._id.toString(),
                  "orderDate": dateTime,
                  "paymentMethod": "B2B",
                  "deliveryAddress": "Inventory",
                  "type":"product",
                  "orderStatus": "pending",
                  "items": [{
                      "productId": productId,
                      "quantity": quantity,
                      "orderPrice": quantity*product.productPrice
                  }]
              });
                console.log(raw)
                let response = await fetch(`${backendUrl}/api/orders/products`, {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                });
                console.log(response)
                setOpen(false);
                window.location.reload();
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Quantity</FormLabel>
                  <Input type="number" />
                </FormControl>
                <Button type="submit" >Submit</Button>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Dropdown>
  );
}

export default function InventoryTable({ data, user,backendUrl }: { data: Product[], user:any, backendUrl:any }) {
  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 240, padding: '12px 6px' }}>Product</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Stock Level</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Supplier ID</th>
              <th style={{ width: 240, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(data, getComparator('asc', '_id')).map((product) => (
              <tr key={product._id}>
                <td>
                  <Typography>{product.name}</Typography>
                </td>
                <td>
                  <Typography>{product.stockLevel}</Typography>
                </td>
                <td>
                  <Typography>{product.supplierId}</Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <RowMenu productId={product._id} supplierId={product.supplierId} user={user} product={product} backendUrl={backendUrl}/>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
