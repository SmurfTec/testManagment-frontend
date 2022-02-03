import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PointSpreadLoading } from 'react-loadingg';

const Loader = ({ noTitle }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        className='cPhARM'
        style={{
          margin: 'auto',
          position: 'absolute',
          inset: 0,
          minWidth: 'fit-content',
          transform: 'translateY(-40px)',
        }}
      >
        {!noTitle && (
          <Typography variant='h4' color='primary'>
            Tester-App
          </Typography>
        )}
      </Box>
      <PointSpreadLoading color={theme.palette.primary.main} />
    </Box>
  );
};

export default Loader;
