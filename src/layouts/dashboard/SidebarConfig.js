import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill),
  },
  {
    title: 'QaManagers',
    path: '/dashboard/qaManagers',
    icon: getIcon(peopleFill),
  },
  {
    title: 'testers',
    path: '/dashboard/testers',
    icon: getIcon(peopleFill),
  },
  {
    title: 'projects',
    path: '/dashboard/projects',
    icon: getIcon(peopleFill),
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(personAddFill),
  },
];

export default sidebarConfig;
