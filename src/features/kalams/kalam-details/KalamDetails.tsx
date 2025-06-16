import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useKalamsData from '../../../hooks/useKalamsData';
import useMerchantData from '../../../hooks/useMerchantData';
import useCustomerData from '../../../hooks/useCustomersData';

const KalamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: data } = useLocation() as { state: any };
  const [editModal, setEditModal] = useState(false);
  const { deleteLoan, updateLoan } = useKalamsData();
  const { updateMerchant } = useMerchantData();
  const { updateCustomer } = useCustomerData();

  if (!data) return <Typography>Loading…</Typography>;

  /** Helper to render a label–value row */
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Grid container spacing={1}>
      <Grid item xs={5} sm={4} md={3}>
        <Typography fontWeight={600}>{label}</Typography>
      </Grid>
      <Grid item xs={7} sm={8} md={9}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );

  /** Section wrapper */
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Box mb={4}>
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );

  const navigate = useNavigate();

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

        if (
          editFormik.touched.name ||
          editFormik.touched.phone ||
          editFormik.touched.altPhone ||
          editFormik.touched.street ||
          editFormik.touched.city ||
          editFormik.touched.zip
        ) {
          updateCustomer(data.customerDetails._id, {
            name: custName,
            contact: contact,
            address: {
              street: street,
              city: city,
              zip: Number(zip),
            },
          });
        }

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
          updateMerchant(data.merchantDetails._id, {
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

        // Assuming addData is a function that handles the submission
        updateLoan(data._id, {
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
        });
        navigate('/kalams');
        editFormik.resetForm();
        setEditModal(false);
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
          value: editFormik.values.name,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.name && Boolean(editFormik.errors.name),
          helperText: editFormik.touched.name && editFormik.errors.name,
        },
        {
          label: 'Phone',
          name: 'phone',
          value: editFormik.values.phone,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.phone && Boolean(editFormik.errors.phone),
          helperText: editFormik.touched.phone && editFormik.errors.phone,
        },
        {
          label: 'Alt Phone',
          name: 'altPhone',
          value: editFormik.values.altPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'street',
          value: editFormik.values.street,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.street && Boolean(editFormik.errors.street),
          helperText: editFormik.touched.street && editFormik.errors.street,
        },
        {
          label: 'City',
          name: 'city',
          value: editFormik.values.city,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.city && Boolean(editFormik.errors.city),
          helperText: editFormik.touched.city && editFormik.errors.city,
        },
        {
          label: 'Zip Code',
          name: 'zip',
          value: editFormik.values.zip,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.zip && Boolean(editFormik.errors.zip),
          helperText: editFormik.touched.zip && editFormik.errors.zip,
        },
      ],
    },
    {
      title: 'Item Details',
      fields: [
        {
          label: 'Item Name',
          name: 'itemName',
          value: editFormik.values.itemName,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.itemName && Boolean(editFormik.errors.itemName),
          helperText: editFormik.touched.itemName && editFormik.errors.itemName,
        },
        {
          label: 'Item Quantity',
          name: 'itemQuantity',
          value: editFormik.values.itemQuantity,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.itemQuantity &&
            Boolean(editFormik.errors.itemQuantity),
          helperText:
            editFormik.touched.itemQuantity && editFormik.errors.itemQuantity,
        },
        {
          label: 'Item Type (Material)',
          name: 'itemMaterial',
          value: editFormik.values.itemMaterial,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.itemMaterial &&
            Boolean(editFormik.errors.itemMaterial),
          helperText:
            editFormik.touched.itemMaterial && editFormik.errors.itemMaterial,
        },
        {
          label: 'Net Weight (gm)',
          type: 'number',
          name: 'netWeight',
          value: editFormik.values.netWeight,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.netWeight &&
            Boolean(editFormik.errors.netWeight),
          helperText:
            editFormik.touched.netWeight && editFormik.errors.netWeight,
        },
        {
          label: 'Gross Weight (gm)',
          type: 'number',
          name: 'grossWeight',
          value: editFormik.values.grossWeight,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.grossWeight &&
            Boolean(editFormik.errors.grossWeight),
          helperText:
            editFormik.touched.grossWeight && editFormik.errors.grossWeight,
        },
        {
          label: 'Purity (%)',
          type: 'number',
          name: 'purity',
          value: editFormik.values.purity,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.purity && Boolean(editFormik.errors.purity),
          helperText: editFormik.touched.purity && editFormik.errors.purity,
        },
        {
          label: 'Gold Rate',
          type: 'number',
          name: 'goldRate',
          value: editFormik.values.goldRate,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.goldRate && Boolean(editFormik.errors.goldRate),
          helperText: editFormik.touched.goldRate && editFormik.errors.goldRate,
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
          value: editFormik.values.totalAmount,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.totalAmount &&
            Boolean(editFormik.errors.totalAmount),
          helperText:
            editFormik.touched.totalAmount && editFormik.errors.totalAmount,
        },
        {
          label: 'Customer Amount',
          type: 'number',
          name: 'customerAmount',
          value: editFormik.values.customerAmount,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.customerAmount &&
            Boolean(editFormik.errors.customerAmount),
          helperText:
            editFormik.touched.customerAmount &&
            editFormik.errors.customerAmount,
        },
        {
          label: 'Dukandar Amount',
          type: 'number',
          name: 'dukandarAmount',
          value: editFormik.values.dukandarAmount,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.dukandarAmount &&
            Boolean(editFormik.errors.dukandarAmount),
          helperText:
            editFormik.touched.dukandarAmount &&
            editFormik.errors.dukandarAmount,
        },
        {
          label: 'Merchant ROI (pm)',
          type: 'number',
          name: 'merchantROI',
          value: editFormik.values.merchantROI,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantROI &&
            Boolean(editFormik.errors.merchantROI),
          helperText:
            editFormik.touched.merchantROI && editFormik.errors.merchantROI,
        },
        {
          label: 'Customer ROI (pm)',
          type: 'number',
          name: 'customerROI',
          value: editFormik.values.customerROI,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.customerROI &&
            Boolean(editFormik.errors.customerROI),
          helperText:
            editFormik.touched.customerROI && editFormik.errors.customerROI,
        },
        {
          type: 'date',
          name: 'loanStartDate',
          value: editFormik.values.loanStartDate,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.loanStartDate &&
            Boolean(editFormik.errors.loanStartDate),
          helperText:
            editFormik.touched.loanStartDate && editFormik.errors.loanStartDate,
        },
      ],
    },
    {
      title: 'Merchant Information',
      fields: [
        // Merchant editFormik details
        {
          label: 'Merchant Name',
          name: 'merchantName',
          value: editFormik.values.merchantName,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantName &&
            Boolean(editFormik.errors.merchantName),
          helperText:
            editFormik.touched.merchantName && editFormik.errors.merchantName,
        },
        {
          label: 'Shop Name',
          name: 'shopName',
          value: editFormik.values.shopName,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.shopName && Boolean(editFormik.errors.shopName),
          helperText: editFormik.touched.shopName && editFormik.errors.shopName,
        },
        {
          label: 'Phone',
          name: 'merchantPhone',
          value: editFormik.values.merchantPhone,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantPhone &&
            Boolean(editFormik.errors.merchantPhone),
          helperText:
            editFormik.touched.merchantPhone && editFormik.errors.merchantPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'merchantStreet',
          value: editFormik.values.merchantStreet,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantStreet &&
            Boolean(editFormik.errors.merchantStreet),
          helperText:
            editFormik.touched.merchantStreet &&
            editFormik.errors.merchantStreet,
        },
        {
          label: 'City',
          name: 'merchantCity',
          value: editFormik.values.merchantCity,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantCity &&
            Boolean(editFormik.errors.merchantCity),
          helperText:
            editFormik.touched.merchantCity && editFormik.errors.merchantCity,
        },
        {
          label: 'Zip Code',
          name: 'merchantZip',
          value: editFormik.values.merchantZip,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error:
            editFormik.touched.merchantZip &&
            Boolean(editFormik.errors.merchantZip),
          helperText:
            editFormik.touched.merchantZip && editFormik.errors.merchantZip,
        },
      ],
    },
  ];

  const deleteloan = async () => {
    try {
      deleteLoan(data._id);
      navigate('/kalams');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" mb={4}>
          Kalam&nbsp;ID:&nbsp;{id === undefined ? '-' : id}
        </Typography>

        {/* Kalam details */}
        <Section title="Kalam Details">
          <Row label="Item name:" value={data.kalam.details.name} />
          <Row label="Material type:" value={data.kalam.details.materialType} />
          <Row label="Gold rate:" value={data.kalam.details.goldRateAtLoan} />
          <Row label="Gross weight:" value={data.kalam.details.grossWeight} />
          <Row label="Net weight:" value={data.kalam.details.netWeight} />
          <Row label="Purity:" value={data.kalam.details.purity} />
          <Row label="Quantity:" value={data.kalam.details.number} />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Loan details */}
        <Section title="Loan Details">
          <Row
            label="Loan start date:"
            value={data.kalam.loanDetails.loanStartDate}
          />
          <Row
            label="Customer amount:"
            value={data.kalam.loanDetails.customerAmt}
          />
          <Row
            label="Customer ROI:"
            value={data.kalam.loanDetails.customerROI}
          />
          <Row
            label="Dukandar amount:"
            value={data.kalam.loanDetails.dukandarAmt}
          />
          <Row
            label="Dukandar ROI:"
            value={data.kalam.loanDetails.merchantROI}
          />
          <Row label="Total amount:" value={data.kalam.loanDetails.totalAmt} />
          <Row label="Validity:" value={data.kalam.loanDetails.validity} />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Customer details */}
        <Section title="Customer Details">
          <Row label="Name:" value={data.customerDetails.name} />
          <Row
            label="Contact:"
            value={data.customerDetails.contact?.[0] ?? '—'}
          />
          <Row
            label="Address:"
            value={
              <>
                {data.customerDetails.address.street},
                {data.customerDetails.address.city},
                {data.customerDetails.address.zip}
              </>
            }
          />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Merchant details */}
        <Section title="Merchant Details">
          <Row label="Name:" value={data.merchantDetails.name} />
          <Row
            label="Contact:"
            value={data.merchantDetails.contact?.[0] ?? '—'}
          />
          <Row
            label="Address:"
            value={
              <>
                {data.merchantDetails.address.street},&nbsp;
                {data.merchantDetails.address.city},&nbsp;
                {data.merchantDetails.address.zip}
              </>
            }
          />
        </Section>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: '8px', width: '30%' }}
            onClick={() => {
              editFormik.setValues({
                name: data.customerDetails.name || '',
                phone: data.customerDetails.contact[0] || '',
                altPhone: data.customerDetails.contact[1] || '',
                street: data.customerDetails.address.street || '',
                city: data.customerDetails.address.city || '',
                zip: data.customerDetails.address.zip || '',
                itemName: data.kalam.details.name || '',
                itemQuantity: String(data.kalam.details.number) || '',
                itemMaterial: data.kalam.details.materialType || '',
                netWeight: String(data.kalam.details.netWeight) || '',
                grossWeight: String(data.kalam.details.grossWeight) || '',
                purity: String(data.kalam.details.purity) || '',
                goldRate: String(data.kalam.details.goldRateAtLoan) || '',
                totalAmount: String(data.kalam.loanDetails.totalAmt) || '',
                customerAmount:
                  String(data.kalam.loanDetails.customerAmt) || '',
                dukandarAmount:
                  String(data.kalam.loanDetails.dukandarAmt) || '',
                merchantROI: String(data.kalam.loanDetails.merchantROI) || '',
                customerROI: String(data.kalam.loanDetails.customerROI) || '',
                loanStartDate: data.kalam.loanDetails.loanStartDate || '',
                merchantName: data.merchantDetails.name || '',
                shopName: data.merchantDetails.shopName || '',
                merchantPhone: data.merchantDetails.contact[0] || '',
                merchantStreet: data.merchantDetails.address.street || '',
                merchantCity: data.merchantDetails.address.city || '',
                merchantZip: data.merchantDetails.address.zip || '',
              });
              setEditModal(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ marginLeft: '8px', width: '30%' }}
            onClick={() => {
              deleteloan();
            }}
          >
            Delete{' '}
          </Button>
        </Box>
      </Paper>

      {/* For edit kalam */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
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
    </Box>
  );
};

export default KalamDetails;
