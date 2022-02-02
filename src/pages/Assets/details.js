// material
import { Stack, Container, Typography, Skeleton, Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import faker from 'faker';
import { sample } from 'lodash';
import NotFound from '../Page404';
import { mockImgAvatar } from '../../utils/mockImages';
import { Carousel } from 'react-responsive-carousel';

// components
import Page from '../../components/Page';
import Label from 'src/components/Label';
import { sentenceCase } from 'sentence-case';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { AssetsContext } from 'src/Contexts/AssetsContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//
const useStyles = makeStyles((theme) => ({
  Carousel: {
    '& img': {
      height: 300,
      objectFit: 'cover',
    },
  },
  carouselItem: {
    '& p': {
      fontSize: '20px !important',
      opacity: '1 !important',
    },
  },
}));

export default function AssetDetails() {
  const { assets, getAssetById, loading } = useContext(AssetsContext);
  const { id } = useParams();
  const [asset, setAsset] = useState();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if (loading) return;

    let el = getAssetById(id);

    if (!el) {
      toast.error('No Asset found... Redirecting');
      setTimeout(() => {
        navigate('/dashboard/assets');
      }, 1500);
    }

    setAsset({ ...el });
  }, [getAssetById, assets, loading, id]);

  return (
    <Page
      title={`${loading ? 'Loading' : asset ? asset.name : '404 | Not Found'}`}
    >
      {loading ? (
        <Skeleton variant='rectangular' height='600px' />
      ) : asset ? (
        <Container>
          <Carousel
            showThumbs={false}
            animationHandler='fade'
            swipeable={false}
            className={classes.Carousel}
            autoPlay
          >
            {asset.images?.map((img) => (
              <Box key={img} className={classes.carouselItem}>
                <img src={img} />
                {/* <Typography className='legend'>
                  {item.name.toUpperCase()}
                </Typography> */}
              </Box>
            ))}
          </Carousel>
          <Stack
            direction='column'
            alignItems='flex-start'
            justifyContent='space-around'
            mb={5}
            mt={2}
          >
            <Typography variant='h4' gutterBottom>
              Asset {asset.name}
            </Typography>

            <Typography variant='body1' gutterBottom>
              Price : {asset.price} $
            </Typography>
          </Stack>
          <Stack
            direction='row'
            alignItems='flex-start'
            justifyContent='flex-start'
            mb={5}
            gap='10px'
          >
            <Typography variant='h4' gutterBottom>
              User : {asset.user?.name}
            </Typography>
            <Avatar alt={asset.user?.name} src={asset.user?.image} />
          </Stack>
        </Container>
      ) : (
        <NotFound />
      )}
    </Page>
  );
}
