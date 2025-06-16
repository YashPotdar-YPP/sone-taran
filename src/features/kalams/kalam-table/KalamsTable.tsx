import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Fab,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { KalamProps } from '../models/KalamProps';
import { CustomerDetails, KalamDetails } from '../models/Kalam';
import { calculateMonthsAndDays } from '../../../utils/CountDaysUtil';
import { calculateAnnualCompoundInterest } from '../../../utils/InterestCalculatorUtil';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useKalamsData from '../../../hooks/useKalamsData';
import useMerchantData from '../../../hooks/useMerchantData';
import useCustomerData from '../../../hooks/useCustomersData';

const KalamsTable: React.FC<KalamProps> = (props) => {
  const { data } = props;
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [selectedKalam, setSelectedKalam] = useState<KalamDetails | null>(null);
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const { addData } = useKalamsData();
  const { searchMerchant, AddMerchantData } = useMerchantData();
  const { searchCustomer, addCustomerData } = useCustomerData();

  const calculateTodaysValue = () => '-';
  
  const formik = useFormik({
    initialValues: {
      name: '',
      itemQuantity: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
      itemName: '',
      itemMaterial: '',
      netWeight: '',
      grossWeight: '',
      purity: '',
      goldRate: '',
      totalAmount: '',
      customerAmount: '',
      merchantROI: '',
      customerROI: '',
      loanStartDate: '',
      merchantName: '',
      shopName: '',
      merchantPhone: '',
      merchantStreet: '',
      merchantCity: '',
      merchantZip: '',
      dukandarAmount: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      itemQuantity: Yup.string().required('Quantity is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zip: Yup.string()
        .required('Pin code is required')
        .matches(/^\d{6}$/, 'Invalid Pin code'),
      itemName: Yup.string().required('Item Name is required'),
      itemMaterial: Yup.string().required('Item Type is required'),
      netWeight: Yup.number().required('Net Weight is required').positive(),
      grossWeight: Yup.number().required('Gross Weight is required').positive(),
      purity: Yup.number().required('Purity is required').positive(),
      goldRate: Yup.number().required('Gold Rate is required').positive(),
      totalAmount: Yup.number().required('Total Amount is required').positive(),
      customerAmount: Yup.number()
        .required('Customer Amount is required')
        .positive(),
      merchantROI: Yup.number().required('Merchant ROI is required').positive(),
      customerROI: Yup.number().required('Customer ROI is required').positive(),
      loanStartDate: Yup.date()
        .required('Loan Start Date is required')
        .nullable(),
      merchantName: Yup.string().required('Merchant Name is required'),
      shopName: Yup.string().required('Shop Name is required'),
      merchantPhone: Yup.string()
        .required('Merchant Phone is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      merchantStreet: Yup.string().required('Merchant Address is required'),
      merchantCity: Yup.string().required('Merchant Address is required'),
      merchantZip: Yup.string().required('Merchant Address is required'),
      dukandarAmount: Yup.string().required('Dukandar Amount is required'),
    }),
    onSubmit: async (values) => {
      console.log('Submitting:', values);

      try {
        const custName = values.name;
        const contact = [values.phone, values.altPhone];
        const { street, city, zip } = values;

        let customerId = '';
        let searchResult;

        try {
          searchResult = await searchCustomer(custName, contact);

          if (searchResult.customer) {
            customerId = searchResult.customer.customerId;
          } else {
            throw new Error('Customer not found'); // fallback to creation
          }
        } catch (error) {
          console.warn('Customer not found. Creating new one...', error);

          const newCustomer = await addCustomerData({
            name: custName,
            contact: contact,
            address: {
              street: street,
              city: city,
              zip: Number(zip),
            },
          });

          customerId = newCustomer.customerId;
        }

        const {
          merchantName,
          shopName,
          merchantStreet,
          merchantCity,
          merchantZip,
        } = values;
        const contactMerchant = [values.merchantPhone];

        let merchantId = '';
        let serachMerchantResult;

        try {
          serachMerchantResult = await searchMerchant(
            merchantName,
            contactMerchant
          );

          if (serachMerchantResult.merchant) {
            merchantId = serachMerchantResult.merchant.merchantId;
          } else {
            throw new Error('Merchant not found');
          }
        } catch (error) {
          const newMerchant = await AddMerchantData({
            name: merchantName,
            shopName: shopName,
            contact: contactMerchant,
            address: {
              street: merchantStreet,
              city: merchantCity,
              zip: Number(merchantZip),
            },
          });

          console.log(newMerchant);

          merchantId = await newMerchant.merchantId;
        }

        // Assuming addData is a function that handles the submission
        addData({
          customerId: customerId,
          loans: {
            details: {
              name: values.itemName,
              number: Number(values.itemQuantity),
              materialType: values.itemMaterial,
              netWeight: Number(values.netWeight),
              grossWeight: Number(values.grossWeight),
              purity: Number(values.purity),
              goldRateAtLoan: Number(values.goldRate),
            },

            loanDetails: {
              totalAmt: Number(values.totalAmount),
              customerAmt: Number(values.customerAmount),
              dukandarAmt: Number(values.dukandarAmount),
              merchantROI: Number(values.merchantROI),
              customerROI: Number(values.customerROI),
              loanStartDate: values.loanStartDate,
              validity: 'valid',
            },
          },
          merchantId: merchantId,
        });

        formik.resetForm();
        setAddModal(false);
      } catch (err) {
        console.error('Add customer error:', err);
      }
    },
  });

  const formSections = [
    {
      title: 'Customer Information',
      fields: [
        {
          label: 'Customer Name',
          name: 'name',
          value: formik.values.name,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.name && Boolean(formik.errors.name),
          helperText: formik.touched.name && formik.errors.name,
        },
        {
          label: 'Phone',
          name: 'phone',
          value: formik.values.phone,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.phone && Boolean(formik.errors.phone),
          helperText: formik.touched.phone && formik.errors.phone,
        },
        {
          label: 'Alt Phone',
          name: 'altPhone',
          value: formik.values.altPhone,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.altPhone && Boolean(formik.errors.altPhone),
          helperText: formik.touched.altPhone && formik.errors.altPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'street',
          value: formik.values.street,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.street && Boolean(formik.errors.street),
          helperText: formik.touched.street && formik.errors.street,
        },
        {
          label: 'City',
          name: 'city',
          value: formik.values.city,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.city && Boolean(formik.errors.city),
          helperText: formik.touched.city && formik.errors.city,
        },
        {
          label: 'Zip Code',
          name: 'zip',
          value: formik.values.zip,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.zip && Boolean(formik.errors.zip),
          helperText: formik.touched.zip && formik.errors.zip,
        },
      ],
    },
    {
      title: 'Item Details',
      fields: [
        {
          label: 'Item Name',
          name: 'itemName',
          value: formik.values.itemName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.itemName && Boolean(formik.errors.itemName),
          helperText: formik.touched.itemName && formik.errors.itemName,
        },
        {
          label: 'Item Quantity',
          name: 'itemQuantity',
          value: formik.values.itemQuantity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.itemQuantity && Boolean(formik.errors.itemQuantity),
          helperText: formik.touched.itemQuantity && formik.errors.itemQuantity,
        },
        {
          label: 'Item Type (Material)',
          name: 'itemMaterial',
          value: formik.values.itemMaterial,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.itemMaterial && Boolean(formik.errors.itemMaterial),
          helperText: formik.touched.itemMaterial && formik.errors.itemMaterial,
        },
        {
          label: 'Net Weight (gm)',
          type: 'number',
          name: 'netWeight',
          value: formik.values.netWeight,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.netWeight && Boolean(formik.errors.netWeight),
          helperText: formik.touched.netWeight && formik.errors.netWeight,
        },
        {
          label: 'Gross Weight (gm)',
          type: 'number',
          name: 'grossWeight',
          value: formik.values.grossWeight,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.grossWeight && Boolean(formik.errors.grossWeight),
          helperText: formik.touched.grossWeight && formik.errors.grossWeight,
        },
        {
          label: 'Purity (%)',
          type: 'number',
          name: 'purity',
          value: formik.values.purity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.purity && Boolean(formik.errors.purity),
          helperText: formik.touched.purity && formik.errors.purity,
        },
        {
          label: 'Gold Rate',
          type: 'number',
          name: 'goldRate',
          value: formik.values.goldRate,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.goldRate && Boolean(formik.errors.goldRate),
          helperText: formik.touched.goldRate && formik.errors.goldRate,
        },
      ],
    },
    {
      title: 'Mortgage Information',
      fields: [
        // Mortgage Information
        {
          label: 'Total Amount',
          type: 'number',
          name: 'totalAmount',
          value: formik.values.totalAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.totalAmount && Boolean(formik.errors.totalAmount),
          helperText: formik.touched.totalAmount && formik.errors.totalAmount,
        },
        {
          label: 'Customer Amount',
          type: 'number',
          name: 'customerAmount',
          value: formik.values.customerAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.customerAmount &&
            Boolean(formik.errors.customerAmount),
          helperText:
            formik.touched.customerAmount && formik.errors.customerAmount,
        },
        {
          label: 'Dukandar Amount',
          type: 'number',
          name: 'dukandarAmount',
          value: formik.values.dukandarAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.dukandarAmount &&
            Boolean(formik.errors.dukandarAmount),
          helperText:
            formik.touched.dukandarAmount && formik.errors.dukandarAmount,
        },
        {
          label: 'Merchant ROI (pm)',
          type: 'number',
          name: 'merchantROI',
          value: formik.values.merchantROI,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantROI && Boolean(formik.errors.merchantROI),
          helperText: formik.touched.merchantROI && formik.errors.merchantROI,
        },
        {
          label: 'Customer ROI (pm)',
          type: 'number',
          name: 'customerROI',
          value: formik.values.customerROI,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.customerROI && Boolean(formik.errors.customerROI),
          helperText: formik.touched.customerROI && formik.errors.customerROI,
        },
        {
          type: 'date',
          name: 'loanStartDate',
          value: formik.values.loanStartDate,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.loanStartDate &&
            Boolean(formik.errors.loanStartDate),
          helperText:
            formik.touched.loanStartDate && formik.errors.loanStartDate,
        },
      ],
    },
    {
      title: 'Merchant Information',
      fields: [
        // Merchant formik details
        {
          label: 'Merchant Name',
          name: 'merchantName',
          value: formik.values.merchantName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantName && Boolean(formik.errors.merchantName),
          helperText: formik.touched.merchantName && formik.errors.merchantName,
        },
        {
          label: 'Shop Name',
          name: 'shopName',
          value: formik.values.shopName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.shopName && Boolean(formik.errors.shopName),
          helperText: formik.touched.shopName && formik.errors.shopName,
        },
        {
          label: 'Phone',
          name: 'merchantPhone',
          value: formik.values.merchantPhone,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantPhone &&
            Boolean(formik.errors.merchantPhone),
          helperText:
            formik.touched.merchantPhone && formik.errors.merchantPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'merchantStreet',
          value: formik.values.merchantStreet,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantStreet &&
            Boolean(formik.errors.merchantStreet),
          helperText:
            formik.touched.merchantStreet && formik.errors.merchantStreet,
        },
        {
          label: 'City',
          name: 'merchantCity',
          value: formik.values.merchantCity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantCity && Boolean(formik.errors.merchantCity),
          helperText: formik.touched.merchantCity && formik.errors.merchantCity,
        },
        {
          label: 'Zip Code',
          name: 'merchantZip',
          value: formik.values.merchantZip,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantZip && Boolean(formik.errors.merchantZip),
          helperText: formik.touched.merchantZip && formik.errors.merchantZip,
        },
      ],
    },
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Kalam</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Loan Amt</TableCell>
              <TableCell>Amt Due</TableCell>
              <TableCell>Customer ROI</TableCell>
              <TableCell>Merchant</TableCell>

              <TableCell>Today's Value</TableCell>
              <TableCell>Validity</TableCell>
              <TableCell>View Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((kalam, index) => {
              const loanStartDate = new Date(
                kalam.kalam.loanDetails.loanStartDate
              );
              const { totalMonths, days } =
                calculateMonthsAndDays(loanStartDate);
              return (
                <TableRow key={kalam._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kalam.kalam.loanId}</TableCell>

                  {/* Customer Name + Info Icon */}
                  <TableCell>
                    {kalam.customerDetails.name}
                    <IconButton
                      disableRipple
                      onClick={() => setSelectedCustomer(kalam.customerDetails)}
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      <InfoIcon fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>

                  {/* Kalam Name + Info Icon */}
                  <TableCell>
                    {kalam.kalam.details.name}
                    <IconButton
                      onClick={() => setSelectedKalam(kalam.kalam)}
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      <InfoIcon fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>

                  <TableCell>{kalam.kalam.loanDetails.loanStartDate}</TableCell>
                  <TableCell>₹{kalam.kalam.loanDetails.customerAmt}</TableCell>
                  <TableCell>
                    ₹
                    {calculateAnnualCompoundInterest(
                      kalam.kalam.loanDetails.customerAmt,
                      kalam.kalam.loanDetails.customerROI * 12,
                      totalMonths,
                      days
                    )}
                  </TableCell>
                  <TableCell>{kalam.kalam.loanDetails.customerROI}%</TableCell>
                  <TableCell>{kalam.merchantDetails.name}</TableCell>
                  <TableCell>{calculateTodaysValue()}</TableCell>
                  <TableCell>-</TableCell>

                  <TableCell>
                    <IconButton
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                      onClick={() =>
                        navigate(`/kalams/${kalam.kalam.loanId}`, {
                          state: kalam,
                        })
                      }
                    >
                      <Visibility fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'none',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'flex-end',
          pr: { xl: 4, xs: 0 },
          mb: 2,
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            height: '0',
            background: 'none',
            boxShadow: 'none',
          }}
        >
          <BottomNavigationAction
            label="Add"
            sx={{ boxShadow: 'none' }}
            icon={
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                  setAddModal(true);
                }}
              >
                <AddIcon />
              </Fab>
            }
          />
        </BottomNavigation>
      </Paper>

      {/* Customer Info Dialog */}
      <Dialog
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      >
        <DialogTitle>Customer Info</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={`${selectedCustomer.address.street}, ${selectedCustomer.address.city} - ${selectedCustomer.address.zip}`}
                />
              </ListItem>
              {selectedCustomer.contact.map((phone, index) => (
                <ListItem key={index} component="a" href={`tel:${phone}`}>
                  <ListItemText primary="Phone" secondary={phone} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Kalam Info Dialog */}
      <Dialog open={!!selectedKalam} onClose={() => setSelectedKalam(null)}>
        <DialogTitle>Kalam Details</DialogTitle>
        <DialogContent>
          {selectedKalam && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Type"
                  secondary={selectedKalam.details.materialType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Net Weight"
                  secondary={`${selectedKalam.details.netWeight}g`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Gross Weight"
                  secondary={`${selectedKalam.details.grossWeight}g`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Purity"
                  secondary={`${selectedKalam.details.purity}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Gold Rate at Loan"
                  secondary={`₹${selectedKalam.details.goldRateAtLoan}`}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* for adding th Kalam  */}
      <Dialog
        open={addModal}
        onClose={() => setAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Kalam</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            {/* Customer Information */}
            <Box sx={{ mt: 2 }}>
              {formSections.map((section, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Grid
                    container
                    spacing={{ xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                  >
                    {section.fields.map((field, idx) => (
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12} key={idx}>
                        <TextField fullWidth {...field} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                sx={{ width: '60%', mt: 4 }}
                type="submit"
              >
                Add Kalam
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KalamsTable;
