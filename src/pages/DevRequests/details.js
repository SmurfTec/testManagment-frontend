// material
import {
  Stack,
  Container,
  Typography,
  Skeleton,
  Avatar,
  Button,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import faker from 'faker';
import NotFound from '../Page404';
import { Carousel } from 'react-responsive-carousel';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
// import { useNavigate } from 'react-router-dom';
// components
import Page from '../../components/Page';
import Label from 'src/components/Label';
import { sentenceCase } from 'sentence-case';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { DevRequestsContext } from 'src/Contexts/DevRequestsContext';
import { useToggleInput } from 'src/hooks';
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

export default function DevelopmentRequestDetails() {
  const { devRequests, getDevRequestById, loading, changeDevRequestStatus } =
    useContext(DevRequestsContext);
  const [devRequest, setDevRequest] = useState();
  const { id } = useParams();
  const [statusChanging, toggleStatusChanging] = useToggleInput(false);

  const classes = useStyles();
  // const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (loading) return;

    let el = getDevRequestById(id);

    if (!el) {
      return setNotFound(true);
      // toast.error('No Menu found... Redirecting');
      // setTimeout(() => {
      //   navigate('/dashboard/development-requests');
      // }, 1500);
    }

    setDevRequest({ ...el });
  }, [devRequests, getDevRequestById, loading, id]);

  const handleDelete = () => {
    // console.log(`id`, id);
    toggleStatusChanging();
    changeDevRequestStatus(id, 'rejected', toggleStatusChanging);
  };
  const handleApprove = () => {
    // console.log(`id`, id);
    toggleStatusChanging();
    changeDevRequestStatus(id, 'approved', toggleStatusChanging);
  };

  const getColor = (status) => {
    return status === 'rejected'
      ? 'error'
      : status === 'approved'
      ? 'primary'
      : 'warning';
  };
  return (
    <Page
      title={`${
        loading ? 'Loading' : devRequest ? devRequest.name : '404 | Not Found'
      }`}
    >
      {loading && <Skeleton variant='rectangular' height='600px' />}
      {notFound && <NotFound />}

      {devRequest && (
        <Container>
          <Carousel
            showThumbs={false}
            animationHandler='fade'
            swipeable={false}
            className={classes.Carousel}
            autoPlay
          >
            {devRequest.game.images.map((img) => (
              <Box key={faker.datatype.uuid()} className={classes.carouselItem}>
                <img src={img} />
                {/* <Typography className='legend'>
                  {item.name.toUpperCase()}
                </Typography> */}
              </Box>
            ))}
          </Carousel>

          {devRequest.status === 'pending' && (
            <Stack
              direction='row'
              alignItems='flex-start'
              justifyContent='flex-end'
              gap='10px'
              mt={2}
            >
              <Button
                variant='contained'
                color='primary'
                startIcon={<DoneIcon />}
                onClick={handleApprove}
                disabled={statusChanging}
              >
                Approve
              </Button>
              <Button
                variant='contained'
                color='error'
                startIcon={<ClearIcon />}
                onClick={handleDelete}
                disabled={statusChanging}
              >
                Reject
              </Button>
            </Stack>
          )}
          <Stack
            direction='column'
            alignItems='flex-start'
            justifyContent='space-around'
            mb={5}
          >
            <Typography variant='h4' gutterBottom>
              Development Request Game
            </Typography>
            <Typography variant='h4' gutterBottom>
              <Label variant='ghost' color={getColor(devRequest.status)}>
                {sentenceCase(devRequest.status)}
              </Label>
            </Typography>
            <Typography variant='h5' gutterBottom>
              Name : {devRequest.game.name}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Description : {devRequest.game.description}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Price : {devRequest.game.price} $
            </Typography>
            <Typography variant='body1' gutterBottom>
              License : <b>{devRequest.game.licenseType}</b>
            </Typography>
            <Typography variant='body1' gutterBottom>
              Category : <b>{devRequest.game.category}</b>
            </Typography>

            <Typography variant='body1' gutterBottom>
              <Label variant='ghost' color={getColor(devRequest.game.status)}>
                {sentenceCase(devRequest.game.status)}
              </Label>
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
              User : {devRequest.user.name}
            </Typography>
            <Avatar alt={devRequest.user.name} src={devRequest.user.image} />
          </Stack>
          <Stack
            direction='column'
            alignItems='flex-start'
            justifyContent='space-around'
            mb={5}
            gap='10px'
          >
            <Typography variant='body1' gutterBottom>
              Email : {devRequest.user.email}
            </Typography>
            <Typography variant='body1' gutterBottom>
              About : {devRequest.user.about}
            </Typography>
          </Stack>
        </Container>
      )}
    </Page>
  );
}
