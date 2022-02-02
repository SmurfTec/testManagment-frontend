// material
import { Stack, Container, Typography, Skeleton, Avatar } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import faker from 'faker';
import { sample } from 'lodash';
import NotFound from '../Page404';
import { mockImgAvatar } from '../../utils/mockImages';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
// components
import Page from '../../components/Page';
import Label from 'src/components/Label';
import { sentenceCase } from 'sentence-case';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { GamesContext } from 'src/Contexts/GamesContext';
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

export default function GameDetails() {
  const navigate = useNavigate();

  const { games, getGameById, loading } = useContext(GamesContext);
  const { id } = useParams();
  const [game, setGame] = useState();

  const classes = useStyles();

  useEffect(() => {
    if (loading) return;

    let el = getGameById(id);

    if (!el) {
      toast.error('No Menu found... Redirecting');
      setTimeout(() => {
        navigate('/dashboard/games');
      }, 1500);
    }

    setGame({ ...el });
  }, [getGameById, games, loading, id]);

  const getColor = (status) => {
    return status === 'rejected'
      ? 'error'
      : status === 'approved'
      ? 'primary'
      : 'warning';
  };
  return (
    <Page
      title={`${loading ? 'Loading' : game ? game.name : '404 | Not Found'}`}
    >
      {loading ? (
        <Skeleton variant='rectangular' height='600px' />
      ) : game ? (
        <Container>
          <Carousel
            showThumbs={false}
            animationHandler='fade'
            swipeable={false}
            className={classes.Carousel}
            autoPlay
          >
            {game.images.map((img) => (
              <Box key={faker.datatype.uuid()} className={classes.carouselItem}>
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
              Game {game.name}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Description : {game.description}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Price : {game.price} $
            </Typography>
            <Typography variant='body1' gutterBottom>
              License : <b>{game.licenseType}</b>
            </Typography>
            <Typography variant='body1' gutterBottom>
              Category : <b>{game.category}</b>
            </Typography>

            <Typography variant='body1' gutterBottom>
              <Label variant='ghost' color={getColor(game.status)}>
                {sentenceCase(game.status)}
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
              User : {game.user.name}
            </Typography>
            <Avatar alt={game.user.name} src={game.user.image} />
          </Stack>
        </Container>
      ) : (
        <NotFound />
      )}
    </Page>
  );
}
