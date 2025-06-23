import { CssBaseline, Typography, Box, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpVerify: React.FC = () => {
  const {
    verifyOtp,
    verifyEmailOtp,
    requestOtp,
    phoneNumber,
    otpSent,
    requestEmailOtp,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const otpfield = location.state;
  console.log(otpfield.emaillogin);

  const formikPhoneOtp = useFormik({
    initialValues: {
      PhoneOtp: '',
    },
    validationSchema: Yup.object({
      PhoneOtp: Yup.string()
        .required('OTP is required')
        .matches(/^\d{6}$/, 'Invalid OTP'),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);

      const success = await verifyOtp(values.PhoneOtp);
      console.log(success);

      if (!success) {
        setError('Invalid OTP. Please try again.');
      } else {
        setSuccess('OTP verified successfully!');
        navigate('/dashboard');
      }
    },
  });

  const formikEmailOtp = useFormik({
    initialValues: {
      EmailOtp: '',
    },
    validationSchema: Yup.object({
      EmailOtp: Yup.string()
        .required('OTP is required')
        .matches(/^\d{6}$/, 'Invalid OTP'),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);

      const success = await verifyEmailOtp(values.EmailOtp);
      console.log(success);

      if (!success) {
        setError('Invalid OTP. Please try again.');
      } else {
        setSuccess('OTP verified successfully!');
        navigate('/dashboard');
      }
    },
  });

  const resendOtp = async () => {
    try {
      await requestOtp(phoneNumber);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const resendEmailOtp = async () => {
    try {
      await requestEmailOtp(otpfield.email);
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Please try again.');
    }
  };
  return (
    <>
      <CssBaseline />
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
            width: { xl: '25%', lg: '30%', md: '50%', sm: '50%', xs: '100%' },
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
          onSubmit={
            otpfield.emaillogin === true
              ? formikEmailOtp.handleSubmit
              : formikPhoneOtp.handleSubmit
          }
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'Bold',
                marginTop: {
                  xl: '-10%',
                  lg: '-12%',
                  md: '-10%',
                  sm: '-14%',
                  xs: '-16%',
                },
              }}
            >
              Sign in
            </Typography>
          </Box>

          {/* Input Box */}
          <Box>
            <TextField
              fullWidth
              type="text"
              id="OTP"
              name={otpfield.emaillogin === true ? 'EmailOtp' : 'PhoneOtp'}
              label="OTP"
              value={
                otpfield.emaillogin === true
                  ? formikEmailOtp.values.EmailOtp
                  : formikPhoneOtp.values.PhoneOtp
              }
              onChange={
                otpfield.emaillogin === true
                  ? formikEmailOtp.handleChange
                  : formikPhoneOtp.handleChange
              }
              onBlur={
                otpfield.emaillogin === true
                  ? formikEmailOtp.handleBlur
                  : formikPhoneOtp.handleBlur
              }
              error={
                otpfield.emaillogin === true
                  ? formikEmailOtp.touched.EmailOtp &&
                    Boolean(formikEmailOtp.errors.EmailOtp)
                  : formikPhoneOtp.touched.PhoneOtp &&
                    Boolean(formikPhoneOtp.errors.PhoneOtp)
              }
              helperText={
                otpfield.emaillogin === true
                  ? formikEmailOtp.touched.EmailOtp &&
                    formikEmailOtp.errors.EmailOtp
                  : formikPhoneOtp.touched.PhoneOtp &&
                    formikPhoneOtp.errors.PhoneOtp
              }
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

            {success && (
              <Typography variant="body2" color="primary" align="center">
                {success}
              </Typography>
            )}
            <Button
              sx={{ width: '100%', alignSelf: 'center', mt: 1 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Verify
            </Button>

            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              <Button
                color="primary"
                sx={{
                  border: 'none',
                  outline: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                }}
                onClick={() => {
                  otpfield.emaillogin === true ? resendEmailOtp() : resendOtp();
                }}
              >
                Resend Otp ?
              </Button>
            </Box>
            {otpfield.emaillogin === true ? (
              ' '
            ) : (
              <Box
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  fontSize: 'larger',
                  display: {
                    xl: 'none',
                    lg: 'none',
                    md: 'none',
                    sm: 'none',
                    xs: 'block',
                  },
                }}
              >
                OTP :- {otpSent}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OtpVerify;
