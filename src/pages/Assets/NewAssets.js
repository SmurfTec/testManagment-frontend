import { useContext, useState } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../components/Page';

//
import ASSETS from '../../_mocks_/assets';
import { AssetList, AssetSort } from 'src/components/_dashboard/assets';
import { AssetsContext } from 'src/Contexts/AssetsContext';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { assets, loading } = useContext(AssetsContext);
  return (
    <Page title='Dashboard: Assets | '>
      <Container>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Assets
        </Typography>

        <Stack
          direction='row'
          flexWrap='wrap-reverse'
          alignItems='center'
          justifyContent='flex-end'
          sx={{ mb: 5 }}
        >
          <Stack direction='row' spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <AssetSort />
          </Stack>
        </Stack>

        <AssetList assets={assets} loading={loading} />
      </Container>
    </Page>
  );
}
