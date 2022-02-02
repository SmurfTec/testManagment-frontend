import PropTypes from 'prop-types';
// material
import { Grid, Skeleton } from '@mui/material';
import ShopProductCard from './AssetCard';
import { v4 } from 'uuid';

// ----------------------------------------------------------------------

AssetList.propTypes = {
  assets: PropTypes.array.isRequired,
};

export default function AssetList({ assets, loading, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {loading
        ? Array(8)
            .fill()
            .map(() => (
              <Grid key={v4()} item xs={12} sm={6} md={3}>
                <Skeleton variant='rectangular' height={250} />
              </Grid>
            ))
        : assets.map((asset) => (
            <Grid key={asset.id} item xs={12} sm={6} md={3}>
              <ShopProductCard asset={asset} />
            </Grid>
          ))}
    </Grid>
  );
}
