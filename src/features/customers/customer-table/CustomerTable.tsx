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
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CustomerProps } from '../models/CustomerProps';
import AddIcon from '@mui/icons-material/Add';
import { CustomerDetails } from '../models/Customers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useCustomerData from '../../../hooks/useCustomersData';

const CustomerTable: React.FC<CustomerProps> = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [addModal, setAddModal] = useState(false);
  const { addCustomerData } = useCustomerData();

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zip: Yup.string()
        .required(' Pin code is required')
        .matches(/^\d{6}$/, 'Invalid Pin code'),
    }),
    onSubmit: async (values) => {
      console.log('Submitting:', values);
      try {
        addCustomerData({
          name: values.name,
          contact: [values.phone, values.altPhone],
          address: {
            street: values.street,
            city: values.city,
            zip: Number(values.zip),
          },
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
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name </TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Validity</TableCell>
              <TableCell>View Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customers, index) => {
              return (
                <TableRow key={customers._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customers.customer.customerId}</TableCell>

                  {/* Customer Name + Info Icon */}
                  <TableCell>{customers.customer.name}</TableCell>

                  <TableCell>
                    {customers.customer.contact[0] === undefined
                      ? '-'
                      : customers.customer.contact[1] === undefined
                      ? customers.customer.contact[0]
                      : `${customers.customer.contact[0]} / ${customers.customer.contact[1]}`}
                  </TableCell>
                  <TableCell>
                    {customers.customer.address.city} -{' '}
                    {customers.customer.address.zip}
                    <IconButton
                      onClick={() => setSelectedCustomer(customers.customer)}
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
                        navigate(
                          `/customers/${customers.customer.customerId}`,
                          {
                            state: customers,
                          }
                        )
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

      <Dialog
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      >
        <DialogContent>
          {selectedCustomer && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Street"
                  secondary={selectedCustomer.address.street}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="City"
                  secondary={selectedCustomer.address.city}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Zip code"
                  secondary={selectedCustomer.address.zip}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={addModal}
        onClose={() => setAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {/* Customer Information */}
          <Box sx={{ mt: 2 }} component="form" onSubmit={formik.handleSubmit}>
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

            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                sx={{ width: '60%', mt: 4 }}
                type="submit"
              >
                Add Customer
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerTable;
