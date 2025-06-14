import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Typography, Box, Paper, Grid, Stack, Divider } from '@mui/material';

const KalamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: data } = useLocation() as { state: any };

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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" mb={4}>
          Kalam&nbsp;ID:&nbsp;{id}
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
      </Paper>
    </Box>
  );
};

export default KalamDetails;
