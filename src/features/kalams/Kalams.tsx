import { useEffect } from 'react';
import styles from './Kalams.module.scss';
import KalamCard from './kalam-card/KalamCard';
import KalamsTable from './kalam-table/KalamsTable';
import useKalamsData from '../../hooks/useKalamsData';
import { TailSpin } from 'react-loader-spinner';
import { Box, Dialog, DialogContent } from '@mui/material';

const Kalams = () => {
  const { data, loading, error, fetchIfNeeded } = useKalamsData();

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
        <KalamCard data={data} />
      </div>
      <div className={styles.desktopView}>
        <KalamsTable data={data} />
      </div>
    </div>
  );
};

export default Kalams;
