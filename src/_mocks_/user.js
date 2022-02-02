import faker from 'faker';
import { sample } from 'lodash';
// utils

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  images: [faker.internet.avatar],
  about: faker.lorem.words(5),
  name: faker.name.findName(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  email: faker.internet.email(),
}));

export default users;
