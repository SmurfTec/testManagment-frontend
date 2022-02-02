import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';
// ----------------------------------------------------------------------

const games = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  user: { name: faker.name.findName() },
  name: faker.lorem.slug(3),
  images: [mockImgAvatar(index + 1)],
  category: sample(['arcade', 'strategy']),
  description: faker.random.words(5),
  price: faker.datatype.number({ min: 10, max: 1000, precision: 100 }),
  licenseType: sample(['regular', 'extended']),
  status: sample(['pending', 'approved', 'rejected']),
}));

export default games;
