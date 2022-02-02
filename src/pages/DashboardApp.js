// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
  AppCard,
} from '../components/_dashboard/app';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PeopleIcon from '@mui/icons-material/People';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WebAssetIcon from '@mui/icons-material/WebAsset';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title=' Admin Dashboard'>
      <Container maxWidth='xl'>
        <Box sx={{ pb: 5 }}>
          <Typography variant='h4'>Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            {/* <AppWeeklySales /> */}
            <AppCard
              title='Games'
              color='primary'
              TOTAL={50}
              Icon={SportsEsportsIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Assets'
              color='info'
              TOTAL={30}
              Icon={WebAssetIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Users'
              color='warning'
              TOTAL={80}
              Icon={PeopleIcon}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Development Requests'
              TOTAL={110}
              Icon={TextSnippetIcon}
              color='error'
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
