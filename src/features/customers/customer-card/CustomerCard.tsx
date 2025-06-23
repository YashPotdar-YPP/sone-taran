import { Box, IconButton, InputBase } from '@mui/material';
import ExpandableCustomerCard from '../../../shared/components/expandable-card/ExpandableCard-Customer/ExpandableCustomerCard';
import { CustomerProps } from '../models/CustomerProps';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function CustomerCard(props: CustomerProps) {
  const { data } = props;
  console.log('data ', data);

  // For filter data
  const [filteredData, setFilteredData] = useState(data);

  //  For Seraching Customer based on search Input
  const searchFunction = (value: any) => {
    const lowerSearch = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.customer.name.toLowerCase().includes(lowerSearch) ||
        item.customer.contact[0].toLowerCase().includes(lowerSearch) ||
        item.customer.contact[1].toLowerCase().includes(lowerSearch) ||
        item.customer.customerId.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
    console.log(filtered);
  };

  // Searching Using Debouncing
  const debouncingSearch = (func: Function, delay: number) => {
    let timer: any;
    return function (...args: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (value: string) => {
    searchFunction(value);
  };

  const debouncedSearchHandler = debouncingSearch(handleSearch, 1000);

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          width: '60%',
          display: 'flex',
          justifyContent: 'flex-end',
          pr: 2,
          border: '1px solid lightgray',
          borderRadius: '10px',
          marginLeft: 'auto',
          mb: 5,
        }}
        component="form"
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Kalam"
          inputProps={{ 'aria-label': 'Search' }}
          onChange={(e) => {
            debouncedSearchHandler(e.target.value);
          }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      {filteredData.map((customerItem, index) => (
        <ExpandableCustomerCard key={index} customer={customerItem} />
      ))}
    </Box>
  );
}
