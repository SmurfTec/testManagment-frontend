// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import { useContext, useEffect, useState } from 'react';
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
  ProjectStats,
  CurrentProjects,
  AppCard,
} from '../components/_dashboard/app';

import PersonIcon from '@mui/icons-material/Person';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FilePresentIcon from '@mui/icons-material/FilePresent';

// ----------------------------------------------------------------------
import { UsersContext } from 'src/Contexts/UsersContext';
import { ProjectsContext } from 'src/Contexts/ProjectsContext';

export default function DashboardApp() {
  const { users, loading } = useContext(UsersContext);
  const { projects, loading: projectsLoading } =
    useContext(ProjectsContext);

  const [testers, setTesters] = useState([]);
  const [qaManagers, setQaManagers] = useState([]);

  useEffect(() => {
    if (!users) return;
    setTesters(users.filter((user) => user.role === 'tester'));
  }, [users]);

  useEffect(() => {
    if (!users) return;
    setQaManagers(users.filter((user) => user.role === 'qaManager'));
  }, [users]);

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
              title='QaManagers'
              color='primary'
              TOTAL={qaManagers.length}
              Icon={PersonIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Testers'
              color='info'
              TOTAL={testers.length}
              Icon={PersonIcon}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Projects'
              color='warning'
              TOTAL={projects.length}
              Icon={FilePresentIcon}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              title='Test Cases'
              TOTAL={110}
              Icon={FactCheckIcon}
              color='error'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <ProjectStats />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CurrentProjects />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={8}>
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
