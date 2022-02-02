import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';
// ----------------------------------------------------------------------

const assets = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  user: { name: faker.name.findName() },
  name: faker.name.findName(),
  images: [mockImgAvatar(index + 1)],
  price: faker.datatype.number({ min: 10, max: 1000, precision: 100 }),
}));

export default assets;
