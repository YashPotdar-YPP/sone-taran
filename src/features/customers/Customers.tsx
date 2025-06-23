import { useEffect } from 'react';
import styles from './Customer.module.scss';
import CustomerCard from './customer-card/CustomerCard';
import CustomerTable from './customer-table/CustomerTable';
import useCustomersData from '../../hooks/useCustomersData';
import { Box, Dialog, DialogContent } from '@mui/material';
import { TailSpin } from 'react-loader-spinner';

const Customers = () => {
  const { data, loading, error, fetchIfNeeded } = useCustomersData();

  useEffect(() => {
    fetchIfNeeded();
  }, []);

  if (loading)
    return (
      <Box>
        <Dialog
          open={loading}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          <DialogContent
            sx={{
              background: 'transparent !important',
              boxShadow: 'none',
              padding: 0,
            }}
          >
            <Box
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#1976d2"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className={styles.mobileView}>
        <CustomerCard data={data} />
      </div>
      <div className={styles.desktopView}>
        <CustomerTable data={data} />
      </div>
    </div>
  );
};

export default Customers;
