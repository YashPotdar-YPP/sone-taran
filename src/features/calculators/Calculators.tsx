import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { calculatorTabs } from '../../constants/CalculatorTabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3, lg: 4 },
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Calculators() {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Determine tab behavior based on screen size and number of tabs
  const getTabsVariant = () => {
    if (isXs) return 'scrollable';
    if (calculatorTabs.length > 6) return 'scrollable';
    return 'standard';
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        pb: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
      }}
    >
      {/* Tab Navigation */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant={getTabsVariant()}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="calculator tabs"
          sx={{
            minHeight: { xs: '48px', sm: '56px' },
            '& .MuiTabs-flexContainer': {
              minWidth: isXs ? 'max-content' : '100%',
              justifyContent: isXs ? 'flex-start' : 'center',
            },
            '& .MuiTabs-scrollButtons': {
              width: { xs: '24px', sm: '32px' },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
            '& .MuiTabs-indicator': {
              height: { xs: '2px', sm: '3px' },
            },
          }}
        >
          {calculatorTabs.map((tab, index) => (
            <Tab
              label={tab.tabName}
              {...a11yProps(index)}
              key={index}
              sx={{
                width: {
                  xs: '30%',
                  sm: '25%',
                  md: '30%',
                  lg: '10%',
                },

                '&:focus': {
                  outline: 'none',
                },
                flex: {
                  xs: '0 0 auto',
                  md: getTabsVariant() === 'standard' ? '1 1 0' : '0 0 auto',
                },

                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem',
                  md: '0.9375rem',
                  lg: '1rem',
                },
                fontWeight: { xs: 600, sm: 500, md: 400 },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                textTransform: 'none',

                // Spacing
                px: { xs: 0.5, sm: 1, md: 1.5, lg: 2 },
                py: { xs: 1, sm: 1.25, md: 1.5 },

                minHeight: { xs: '44px', sm: '48px' },

                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',

                '&:hover': {
                  backgroundColor: { md: 'action.hover' },
                  opacity: { xs: 1, md: 0.8 },
                },
                // Active state
                '&.Mui-selected': {
                  fontWeight: { xs: 700, sm: 600, md: 500 },
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content Panels */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {calculatorTabs.map((tab, index) => (
          <CustomTabPanel value={value} index={index} key={index}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                '& *': {
                  boxSizing: 'border-box',
                },
                '& .MuiGrid-container': {
                  width: '100% !important',
                  maxWidth: '100% !important',
                },
                '& table': {
                  width: '100%',
                  overflowX: 'auto',
                  display: { xs: 'block', md: 'table' },
                },
              }}
            >
              {React.createElement(tab.component)}
            </Box>
          </CustomTabPanel>
        ))}
      </Box>
    </Box>
  );
}
