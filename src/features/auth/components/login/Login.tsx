import {
  Typography,
  Box,
  TextField,
  Button,
  CssBaseline,
  Divider,
  Dialog,
  DialogContent,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

const LogIn: React.FC = () => {
  const { requestOtp, requestEmailOtp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [emailLogin, setEmail] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const formikPhone = useFormik({
    initialValues: {
      phone: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    }),
    onSubmit: async (values) => {
      setError(null);

      try {
        setLoading(true);
        await requestOtp(Number(values.phone));
        setLoading(false);
        navigate('/otp-verify');
      } catch (err) {
        console.error(err);
        setError('Failed to send OTP. Please try again.');
      }
    },
  });

  const formikEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    }),
    onSubmit: async (values) => {
      setError(null);

      try {
        setLoading(true);
        await requestEmailOtp(values.email);
        setLoading(false);
        var stateObj = {
          emaillogin: emailLogin,
          email: values.email,
        };
        navigate('/otp-verify', { state: stateObj });
      } catch (err) {
        console.error(err);
        setError('Failed to send OTP. Please try again.');
      }
    },
  });

  return (
    <>
      <CssBaseline />
      <Box>
        {emailLogin === false ? (
          <Box
            sx={{
              minHeight: '95vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Box
              sx={{
                width: {
                  xl: '25%',
                  lg: '30%',
                  md: '50%',
                  sm: '50%',
                  xs: '100%',
                },
                height: '90vh',
                border: '1px solid #e1e1e1',
                backgroundColor: '#f7f8f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
              }}
              component="form"
              onSubmit={formikPhone.handleSubmit}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'Bold',
                    marginTop: {
                      xl: '-25%',
                      lg: '-28%',
                      md: '-25%',
                      sm: '-30%',
                      xs: '-35%',
                    },
                  }}
                >
                  Sign in
                </Typography>
              </Box>

              {/* Input Box */}
              <Box>
                <TextField
                  type="text"
                  label="Phone Number"
                  name="phone"
                  id="phone"
                  placeholder="Phone Numbers"
                  focused
                  fullWidth
                  value={formikPhone.values.phone}
                  onChange={formikPhone.handleChange}
                  onBlur={formikPhone.handleBlur}
                  error={
                    formikPhone.touched.phone &&
                    Boolean(formikPhone.errors.phone)
                  }
                  helperText={
                    formikPhone.touched.phone && formikPhone.errors.phone
                  }
                  sx={{ color: '#cbcbcb', marginTop: '-15%' }}
                />
                {error && (
                  <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{ marginTop: '-1%' }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  sx={{ width: '100%', alignSelf: 'center', mt: 1, mb: 3 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {}}
                >
                  Send OTP
                </Button>
                {/* For horizontal line and text over it  */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 1200,
                    mx: 'auto',
                    my: 4,
                    px: 2,
                  }}
                >
                  <Divider
                    sx={{
                      borderColor: '#e0e0e0',
                      position: 'relative',
                      height: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: '#f7f8f9',
                      px: 2,
                      color: '#6b7280',
                      fontWeight: 600,
                      borderRadius: 1,
                      userSelect: 'none',
                      fontSize: 18,
                    }}
                  >
                    or
                  </Typography>
                </Box>

                <Box>
                  <Button
                    sx={{
                      width: '100%',
                      alignSelf: 'center',
                      mt: 1,
                      mb: 3,
                      border: '1px solid',
                    }}
                    onClick={() => {
                      setEmail(true);
                    }}
                    startIcon={<EmailIcon />}
                  >
                    Sign in with email
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          // For email
          <Box
            sx={{
              minHeight: '95vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Box
              sx={{
                width: {
                  xl: '25%',
                  lg: '30%',
                  md: '50%',
                  sm: '50%',
                  xs: '100%',
                },
                height: '90vh',
                border: '1px solid #e1e1e1',
                backgroundColor: '#f7f8f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
              }}
              component="form"
              onSubmit={formikEmail.handleSubmit}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'Bold',
                    marginTop: {
                      xl: '-25%',
                      lg: '-28%',
                      md: '-25%',
                      sm: '-30%',
                      xs: '-35%',
                    },
                  }}
                >
                  Sign in
                </Typography>
              </Box>

              {/* Input Box */}
              <Box>
                <TextField
                  type="text"
                  label="Email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  focused
                  fullWidth
                  value={formikEmail.values.email}
                  onChange={formikEmail.handleChange}
                  onBlur={formikEmail.handleBlur}
                  error={
                    formikEmail.touched.email &&
                    Boolean(formikEmail.errors.email)
                  }
                  helperText={
                    formikEmail.touched.email && formikEmail.errors.email
                  }
                  sx={{ color: '#cbcbcb', marginTop: '-15%' }}
                />
                {error && (
                  <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{ marginTop: '-1%' }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  sx={{ width: '100%', alignSelf: 'center', mt: 1, mb: 3 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Send OTP
                </Button>
                {/* For horizontal line and text over it  */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 1200,
                    mx: 'auto',
                    my: 4,
                    px: 2,
                  }}
                >
                  <Divider
                    sx={{
                      borderColor: '#e0e0e0',
                      position: 'relative',
                      height: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: '#f7f8f9',
                      px: 2,
                      color: '#6b7280',
                      fontWeight: 600,
                      borderRadius: 1,
                      userSelect: 'none',
                      fontSize: 18,
                    }}
                  >
                    or
                  </Typography>
                </Box>

                <Box>
                  <Button
                    sx={{
                      width: '100%',
                      alignSelf: 'center',
                      mt: 1,
                      mb: 3,
                      border: '1px solid',
                    }}
                    onClick={() => {
                      {
                        emailLogin === true ? setEmail(false) : setEmail(true);
                      }
                    }}
                    startIcon={<EmailIcon />}
                  >
                    Sign in with Phone Number
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

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
    </>
  );
};

export default LogIn;
