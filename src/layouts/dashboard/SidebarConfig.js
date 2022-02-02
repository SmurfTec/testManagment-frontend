import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'home',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'games',
    path: '/dashboard/games',
    icon: getIcon(peopleFill),
  },
  {
    title: 'assets',
    path: '/dashboard/assets',
    icon: getIcon(peopleFill),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon(peopleFill),
  },
  {
    title: 'Development Requests',
    path: '/dashboard/development-requests',
    icon: getIcon(shoppingBagFill),
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(personAddFill),
  },
];

export default sidebarConfig;
