import { Box, IconButton, InputBase } from '@mui/material';
import ExpandableCards from '../../../shared/components/expandable-card/ExpandableCard-Kalam/ExpandableCard';
import { KalamProps } from '../models/KalamProps';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function KalamCard(props: KalamProps) {
  const { data } = props;
  console.log('data ', data);

  // For filter data
  const [filteredData, setFilteredData] = useState(data);

  //  For Seraching kalam based on search Input
  const searchFunction = (value: any) => {
    const lowerSearch = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.customerDetails.name.toLowerCase().includes(lowerSearch) ||
        item.kalam.details.name.toLowerCase().includes(lowerSearch) ||
        item.kalam.loanId.toLowerCase().includes(lowerSearch)
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
    <>
      {/* for cards  */}
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

        {filteredData.map((kalamItem, index) => (
          <ExpandableCards key={index} kalam={kalamItem} />
        ))}
      </Box>
    </>
  );
}
