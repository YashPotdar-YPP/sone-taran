import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Avatar,
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  BottomNavigation,
  Paper,
  BottomNavigationAction,
  Grid,
  TextField,
  Fab,
  ListItem,
  ListItemText,
  List,
} from '@mui/material';
import { purple } from '@mui/material/colors';
import StatusChip from '../../status-chip/StatusChip';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import Divider from '@mui/material/Divider';
import { Kalam } from '../../../../features/kalams/models/Kalam';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useKalamsData from '../../../../hooks/useKalamsData';
import apiService from '../../../../services/apiService';
import useCustomerData from '../../../../hooks/useCustomersData';
import useMerchantData from '../../../../hooks/useMerchantData';
import { TailSpin } from 'react-loader-spinner';

interface ExpandableCardProps {
  kalam: Kalam;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ kalam }) => {
  // Expanding cards
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Custom Hooks
  const { addData, updateLoan, deleteLoan } = useKalamsData();
  const { updateCustomer } = useCustomerData();
  const { searchMerchant, AddMerchantData, updateMerchant } = useMerchantData();

  // Opening modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Toggle the expanded state when the card is
  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();

  // For Loader
  const [loading, setLoading] = useState<boolean>(false);
  if (loading) {
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
  }

  //  formik for add kalam form validation
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
      dueAmount: '',
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
      dueAmount: Yup.number().positive(),
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
        //Customer
        const custName = values.name;
        const contact = [values.phone, values.altPhone];
        const { street, city, zip } = values;

        let customerId = '';
        let searchResult;

        try {
          // for searching if the customer exists
          searchResult = await apiService.searchCustomer(custName, contact);

          if (searchResult.customer) {
            customerId = searchResult.customer.customerId;
          } else {
            throw new Error('Customer not found'); // fallback to creation
          }
        } catch (error) {
          console.warn('Customer not found. Creating new one...', error);

          // for adding a new customer
          const newCustomer = await apiService.AddCustomerData({
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

        //Merchant
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
          // For searching if the merchant exist
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
          // For adding a new merchant
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

          merchantId = newMerchant.merchantId;
        }

        // Kalam
        setLoading(true);
        // For adding a new Kalam
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
              dueAmount: Number(values.dueAmount),
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
        setLoading(false);
      } catch (err) {
        console.error('Add customer error:', err);
      }
    },
  });

  //  formik for edit kalam form validation
  const editFormik = useFormik({
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
      dueAmount: '',
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
    enableReinitialize: true, // Important to allow patching
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
      dueAmount: Yup.number().positive(),
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
        // Customer

        const custName = values.name;
        const contact = [values.phone, values.altPhone];
        const { street, city, zip } = values;

        if (
          editFormik.touched.name ||
          editFormik.touched.phone ||
          editFormik.touched.altPhone ||
          editFormik.touched.street ||
          editFormik.touched.city ||
          editFormik.touched.zip
        ) {
          // for updating the customer

          updateCustomer(kalam.customerDetails._id, {
            name: custName,
            contact: contact,
            address: {
              street: street,
              city: city,
              zip: Number(zip),
            },
          });
        }

        // Merchant
        const {
          merchantName,
          shopName,
          merchantStreet,
          merchantCity,
          merchantZip,
        } = values;
        const contactMerchant = [values.merchantPhone];

        if (
          editFormik.touched.merchantName ||
          editFormik.touched.shopName ||
          editFormik.touched.merchantCity ||
          editFormik.touched.merchantPhone ||
          editFormik.touched.merchantStreet ||
          editFormik.touched.merchantZip
        ) {
          // for updating merchant

          updateMerchant(kalam.merchantDetails._id, {
            name: merchantName,
            shopName: shopName,
            contact: contactMerchant,
            address: {
              street: merchantStreet,
              city: merchantCity,
              zip: Number(merchantZip),
            },
          });
        }

        // for updating the kalam

        setLoading(true);
        updateLoan(kalam._id, {
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
              dueAmount: Number(values.dueAmount),
              merchantROI: Number(values.merchantROI),
              customerROI: Number(values.customerROI),
              loanStartDate: values.loanStartDate,
              validity: 'valid',
            },
          },
        });

        formik.resetForm();
        setAddModal(false);
        setLoading(false);
      } catch (err) {
        console.error('Add customer error:', err);
      }
    },
  });

  // form specfication
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
          label: 'Due Amount',
          type: 'number',
          name: 'dueAmount',
          value: formik.values.dueAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.dueAmount && Boolean(formik.errors.dueAmount),
          helperText: formik.touched.dueAmount && formik.errors.dueAmount,
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

  // for deleting kalam
  const deleteloan = async () => {
    try {
      deleteLoan(kalam._id);
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <>
      {/* Card for showing kalam  */}
      <Card
        sx={{
          cursor: 'pointer',
          mt: 2,
        }}
      >
        <Box
          onClick={() => {
            handleCardClick();
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '2px',
            }}
          >
            <Avatar
              sx={{
                bgcolor: purple[500],
                height: 33,
                fontSize: '13px',
                fontWeight: 800,
              }}
              variant="square"
            >
              {kalam.kalam.loanId}
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: '700' }}>
                  {kalam.customerDetails.name}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                  {kalam.kalam.details.name}
                  <IconButton
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    sx={{ marginLeft: '2px', padding: 0 }}
                  >
                    <InfoIcon
                      color="primary"
                      sx={{ width: '13px', height: '13px' }}
                    />
                  </IconButton>
                </Typography>
              </Box>
            </Box>
            <StatusChip status="active" />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', gap: 1, padding: '0.5rem' }}>
            <Box>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  {kalam.kalam.loanDetails.loanStartDate}
                </Typography>
              </Typography>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  {kalam.kalam.loanDetails.validity}
                </Typography>
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  Amt:
                </Typography>
                {' 12000'}
              </Typography>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  ROI:
                </Typography>
                {' 3%'}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  component="span"
                  fontWeight="bold"
                  sx={{ fontSize: '12px' }}
                >
                  Merchant:
                </Typography>
                {kalam.merchantDetails.name}
              </Typography>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  Due:
                </Typography>
                {' 12000'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/kalams/${kalam.kalam.loanId}`, {
                  state: kalam,
                })
              }
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginLeft: '8px' }}
              onClick={() => {
                editFormik.setValues({
                  name: kalam.customerDetails.name || '',
                  phone: kalam.customerDetails.contact[0] || '',
                  altPhone: kalam.customerDetails.contact[1] || '',
                  street: kalam.customerDetails.address.street || '',
                  city: kalam.customerDetails.address.city || '',
                  zip: kalam.customerDetails.address.zip || '',
                  itemName: kalam.kalam.details.name || '',
                  itemQuantity: String(kalam.kalam.details.number) || '',
                  itemMaterial: kalam.kalam.details.materialType || '',
                  netWeight: String(kalam.kalam.details.netWeight) || '',
                  grossWeight: String(kalam.kalam.details.grossWeight) || '',
                  purity: String(kalam.kalam.details.purity) || '',
                  goldRate: String(kalam.kalam.details.goldRateAtLoan) || '',
                  totalAmount: String(kalam.kalam.loanDetails.totalAmt) || '',
                  customerAmount:
                    String(kalam.kalam.loanDetails.customerAmt) || '',
                  dukandarAmount:
                    String(kalam.kalam.loanDetails.dukandarAmt) || '',
                  dueAmount: String(kalam.kalam.loanDetails.dueAmount),
                  merchantROI:
                    String(kalam.kalam.loanDetails.merchantROI) || '',
                  customerROI:
                    String(kalam.kalam.loanDetails.customerROI) || '',
                  loanStartDate: kalam.kalam.loanDetails.loanStartDate || '',
                  merchantName: kalam.merchantDetails.name || '',
                  shopName: kalam.merchantDetails.shopName || '',
                  merchantPhone: kalam.merchantDetails.contact[0] || '',
                  merchantStreet: kalam.merchantDetails.address.street || '',
                  merchantCity: kalam.merchantDetails.address.city || '',
                  merchantZip: kalam.merchantDetails.address.zip || '',
                });
                setEditModal(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ marginLeft: '8px' }}
              onClick={() => {
                deleteloan();
              }}
            >
              Delete
            </Button>
          </CardContent>
        </Collapse>
      </Card>

      {/* modal for viewing kalma details  */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Kalam Details</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Item Name"
                secondary={kalam.kalam.details.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Material Type"
                secondary={kalam.kalam.details.materialType}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Net Weight"
                secondary={`${kalam.kalam.details.netWeight}g`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Gross Weight"
                secondary={`${kalam.kalam.details.grossWeight}g`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Purity"
                secondary={`${kalam.kalam.details.purity}%`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Gold Rate at Loan"
                secondary={`₹${kalam.kalam.details.goldRateAtLoan}`}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      {/* Model for adding new kalma */}
      <Dialog
        open={addModal}
        onClose={() => {
          setAddModal(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Kalams</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 2 }}>
              {formSections.map((section, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {section.fields.map((field, idx) => (
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12} key={idx}>
                        <TextField fullWidth {...field} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{ width: '60%', mt: 4, mx: 'auto' }}
              type="submit"
            >
              Add Kalam
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* For edit kalam */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {/* Customer Information */}
          <Box
            sx={{ mt: 2 }}
            component="form"
            onSubmit={editFormik.handleSubmit}
          >
            <Box sx={{ mt: 2 }}>
              {formSections.map((section, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {section.fields.map((field, idx) => {
                      const formikObj = {
                        ...field,
                        value:
                          editFormik.values[
                            field.name as keyof typeof editFormik.values
                          ],
                        onChange: editFormik.handleChange,
                        onBlur: editFormik.handleBlur,
                        error:
                          editFormik.touched[
                            field.name as keyof typeof editFormik.touched
                          ] &&
                          Boolean(
                            editFormik.errors[
                              field.name as keyof typeof editFormik.errors
                            ]
                          ),
                        helperText:
                          editFormik.touched[
                            field.name as keyof typeof editFormik.touched
                          ] &&
                          editFormik.errors[
                            field.name as keyof typeof editFormik.errors
                          ],
                      };
                      return (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          key={idx}
                        >
                          <TextField fullWidth {...formikObj} />
                        </Grid>
                      );
                    })}
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
                Save Changes
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* for add button to add new kalam  */}
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
    </>
  );
};
export default ExpandableCard;
