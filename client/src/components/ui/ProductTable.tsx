/* eslint-disable jsx-a11y/anchor-is-valid */
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Dropdown from '@mui/joy/Dropdown';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import * as React from 'react';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { DialogContent, DialogTitle, Stack } from '@mui/joy';

// Assuming the rows format is like this
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
// the products array is get from the backend API and passed to the table



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
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
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



function RowMenu({productId,supplierId,backendUrl}:{productId:string,supplierId:string,backendUrl:any}) {
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
          <MenuItem onClick={() => setOpen(true)}>Change Stock</MenuItem>
          <Divider />
          <MenuItem color="danger">Delete (Not working)</MenuItem>
        </Menu>
        <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Add Stock</DialogTitle>
          <DialogContent>
            <form
              onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                // send form data to API
                let myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                console.log(event.currentTarget)
                let raw = JSON.stringify({
                  "stockLevel": Number((event.currentTarget[0] as HTMLInputElement).value),
                  "productId": productId,
                  "supplierId": supplierId
                });
                console.log(raw)
                let response = await fetch(`${backendUrl}/api/products/stock`, {
                  method: 'PUT',
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
                  <FormLabel>Stock Level</FormLabel>
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

export default function ProductTable({products,backendUrl}:any) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
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
              <th style={{ width: 440, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Price</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Stock Level</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Categories</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
      <tbody>
        {stableSort(products, getComparator(products, '_id')).map((product: any) => (
          <tr key={product._id}>
            
            <td>
              <Typography level="body-xs">{product.name}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{product.description}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{product.productPrice} €</Typography>
            </td>
            <td>
              <Typography level="body-xs">{product.stockLevel}</Typography>
            </td>
            <td>
              {product.categories.map((category: { _id: React.Key | null | undefined; type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }) => (
                <Typography key={category._id} level="body-xs">
                  - {category.type}
                </Typography>
              ))}
            </td>
           
            <td>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <RowMenu productId={product._id} supplierId={product.supplierId} backendUrl={backendUrl} />
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
