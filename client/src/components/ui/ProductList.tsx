import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface ProductItem {
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

const listItems: ProductItem[] = [
  // ... (your product items data here)
];

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function ProductList() {
  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {listItems.map((productItem) => (
        <List
          key={productItem._id}
          size="sm"
          sx={{
            '--ListItem-paddingX': 0,
          }}
        >
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
              <ListItemDecorator>
                <Avatar size="sm">{productItem.name.charAt(0)}</Avatar>
              </ListItemDecorator>
              <div>
                <Typography fontWeight={600} gutterBottom>
                  {productItem.name}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  {productItem.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography level="body-xs">{`$${productItem.productPrice.toFixed(2)}`}</Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">{`Stock: ${productItem.stockLevel}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {/* Additional actions or links can be added here */}
                  <RowMenu />
                </Box>
              </div>
            </ListItemContent>
            {/* You can customize the Chip component based on the product's status or category */}
            <Chip
              variant="soft"
              size="sm"
              startDecorator={<CheckRoundedIcon />}  
              color={'success' as ColorPaletteProp}
            >
              Available
            </Chip>
          </ListItem>
          <ListDivider />
        </List>
      ))}
      {/* Pagination section can be added if needed */}
    </Box>
  );
}
