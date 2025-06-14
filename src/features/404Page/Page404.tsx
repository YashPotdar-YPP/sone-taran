import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  }, []);

  return (
    <Box>
      <Typography>Oops! The page you're looking for does not exist.</Typography>
    </Box>
  );
};

export default LogOut;
