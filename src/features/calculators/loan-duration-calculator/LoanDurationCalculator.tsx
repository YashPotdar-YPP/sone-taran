import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DurationResult } from '../../../models/DurationResult';
import {
  calculateRoundedMonthsAndDays,
  calculateMonthsAndDays,
} from '../../../utils/CountDaysUtil';

const LoanDurationCalculator = () => {
  const [actualDuration, setActualDuration] = useState<DurationResult | null>(
    null
  );
  const [roundOffDuration, setRoundOffDuration] =
    useState<DurationResult | null>(null);

  const formik = useFormik({
    initialValues: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      waiveOneDayInterest: false,
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .test(
          'is-greater',
          'End date must be greater than start date',
          function (value) {
            const { startDate } = this.parent;
            return value && startDate && new Date(value) > new Date(startDate);
          }
        ),
    }),
    onSubmit: (values) => {
      const { startDate, endDate, waiveOneDayInterest } = values;

      const rounded = calculateRoundedMonthsAndDays(
        startDate,
        endDate,
        waiveOneDayInterest
      );
      const actual = calculateMonthsAndDays(startDate, endDate);

      setRoundOffDuration(rounded);
      setActualDuration(actual);
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setRoundOffDuration(null);
    setActualDuration(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 }, mt: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Loan Duration Calculator
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <DatePicker
              label="Start Date"
              value={formik.values.startDate}
              onChange={(newValue) =>
                formik.setFieldValue('startDate', newValue)
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(
                    formik.touched.startDate && formik.errors.startDate
                  ),
                  helperText:
                    formik.touched.startDate && formik.errors.startDate,
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={formik.values.endDate}
              onChange={(newValue) => formik.setFieldValue('endDate', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(
                    formik.touched.endDate && formik.errors.endDate
                  ),
                  helperText: formik.touched.endDate && formik.errors.endDate,
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.waiveOneDayInterest}
                  onChange={formik.handleChange}
                  name="waiveOneDayInterest"
                />
              }
              label="1 Day Interest Free"
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
              >
                Calculate
              </Button>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Box>

          {/* Results */}
          {actualDuration && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="h6">Actual Loan Duration:</Typography>
              <Typography variant="body1">
                {actualDuration.totalMonths} month
                {actualDuration.totalMonths !== 1 && 's'}
              </Typography>
              <Typography variant="body1">
                {actualDuration.days} day{actualDuration.days !== 1 && 's'}
              </Typography>
            </Box>
          )}

          {roundOffDuration && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                backgroundColor: '#f1f1f1',
              }}
            >
              <Typography variant="h6">Rounded Loan Duration:</Typography>
              <Typography variant="body1">
                {roundOffDuration.totalMonths} month
                {roundOffDuration.totalMonths !== 1 && 's'}
              </Typography>
              <Typography variant="body1">
                {roundOffDuration.days} day{roundOffDuration.days !== 1 && 's'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default LoanDurationCalculator;
