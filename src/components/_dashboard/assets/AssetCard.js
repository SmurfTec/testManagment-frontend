import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Avatar,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

AssetCard.propTypes = {
  asset: PropTypes.object,
};

export default function AssetCard({ asset }) {
  const { name, images, price, user, _id } = asset;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dashboard/assets/${_id}`);
  };

  return (
    <Card onClick={handleClick}>
      <CardActionArea>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <ProductImgStyle alt={name} src={images[0]} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link to='#' color='inherit' underline='hover' component={RouterLink}>
            <Typography variant='subtitle2' noWrap>
              {name}
            </Typography>
          </Link>

          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            {/* <Typography variant='subtitle1'>{user?.name}</Typography> */}
            <Typography variant='subtitle1'>
              &nbsp;
              {fCurrency(price)}
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
