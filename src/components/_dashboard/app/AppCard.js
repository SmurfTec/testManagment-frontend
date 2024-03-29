import { Icon } from '@iconify/react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme, ownerState }) => {
  const { color } = ownerState;
  return {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: theme.palette[color].darker,
    backgroundColor: theme.palette[color].lighter,
  };
});

const IconWrapperStyle = styled('div')(({ theme, ownerState }) => {
  const { color } = ownerState;
  return {
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette[color].dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(
      theme.palette[color].dark,
      0
    )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
  };
});

// ----------------------------------------------------------------------

// const TOTAL = 714000;

export default function AppWeeklySales({ Icon, title, TOTAL, color }) {
  return (
    <RootStyle ownerState={{ color }}>
      <IconWrapperStyle ownerState={{ color }}>
        <Icon />
      </IconWrapperStyle>
      <Typography variant='h3'>{fShortenNumber(TOTAL)}</Typography>
      <Typography variant='subtitle2' sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </RootStyle>
  );
}
