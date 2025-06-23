import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Container,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { InterestBreakdown } from '../../../models/InterestBreakdown';
import CompoundInterestTable from '../../../shared/components/compound-interest-table/CompoundInterestTable';
import {
  calculateRoundedMonthsAndDays,
  calculateMonthsAndDays,
} from '../../../utils/CountDaysUtil';
import {
  calculateAnnualInterest,
  interestBreakdown,
} from '../../../utils/InterestCalculatorUtil';
import { InterestType } from '../../../enums/interestType';
import { formatCurrency } from '../../../utils/CurrencyUtil';

const InterestCalculator = () => {
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalInterestBreakdown, setTotalInterestBreakdown] = useState<
    InterestBreakdown[]
  >([]);

  const formik = useFormik({
    initialValues: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      loanAmount: '',
      roi: '',
      waiveOneDayInterest: false,
      roundOffLoanDuration: true,
      interestType: InterestType.Compound,
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date()
        .required('End Date is required')
        .test(
          'is-greater',
          'End Date must be greater than Start Date',
          function (value) {
            const { startDate } = this.parent;
            return value && startDate && new Date(value) > new Date(startDate);
          }
        ),
      loanAmount: Yup.number()
        .required('Loan Amount is required')
        .positive('Loan Amount must be positive'),
      roi: Yup.number()
        .required('ROI is required')
        .positive('ROI must be positive'),
    }),
    onSubmit: (values) => {
      const {
        startDate,
        endDate,
        loanAmount,
        roi,
        waiveOneDayInterest,
        roundOffLoanDuration,
        interestType,
      } = values;

      const duration = roundOffLoanDuration
        ? calculateRoundedMonthsAndDays(startDate, endDate, waiveOneDayInterest)
        : calculateMonthsAndDays(startDate, endDate);

      const compoundInterest = calculateAnnualInterest(
        Number(loanAmount),
        Number(roi) * 12,
        duration.totalMonths,
        duration.days,
        interestType === InterestType.Compound
      );

      const compoundInterestBreakdown = interestBreakdown(
        Number(loanAmount),
        Number(roi) * 12,
        duration.totalMonths,
        duration.days,
        interestType === InterestType.Compound
      );

      setTotalInterest(compoundInterest);
      setTotalInterestBreakdown(compoundInterestBreakdown);
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setTotalInterest(null);
    setTotalInterestBreakdown([]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{ padding: { xs: 2, sm: 4 }, marginTop: { xs: 2, sm: 3 } }}
        >
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Compound Interest Calculator
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* Date Pickers */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
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
                onChange={(newValue) =>
                  formik.setFieldValue('endDate', newValue)
                }
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
            </Box>

            {/* Loan Amount and ROI */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
            >
              <TextField
                fullWidth
                type="number"
                id="loanAmount"
                name="loanAmount"
                label="Loan Amount"
                value={formik.values.loanAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.loanAmount && Boolean(formik.errors.loanAmount)
                }
                helperText={
                  formik.touched.loanAmount && formik.errors.loanAmount
                }
              />
              <TextField
                fullWidth
                type="number"
                id="roi"
                name="roi"
                label="Rate of Interest (ROI)"
                value={formik.values.roi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.roi && Boolean(formik.errors.roi)}
                helperText={formik.touched.roi && formik.errors.roi}
              />
            </Box>

            {/* Options */}
            <Box>
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.roundOffLoanDuration}
                    onChange={formik.handleChange}
                    name="roundOffLoanDuration"
                  />
                }
                label="Round off Loan Duration"
              />
              <FormControl>
                <RadioGroup
                  row
                  name="interestType"
                  value={formik.values.interestType}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    control={<Radio />}
                    value={InterestType.Compound}
                    label={InterestType.Compound + ' Interest'}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    value={InterestType.Simple}
                    label={InterestType.Simple + ' Interest'}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                gap: 2,
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
                color="secondary"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Box>

          {/* Result Summary */}
          {totalInterest !== null && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="h6">
                Total Loan + Interest: {formatCurrency(totalInterest)}
              </Typography>
            </Box>
          )}

          {/* Breakdown Table */}
          {totalInterestBreakdown?.length > 0 && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Breakdown
              </Typography>
              <CompoundInterestTable data={totalInterestBreakdown as any} />
            </Box>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default InterestCalculator;
