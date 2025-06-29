import { ComputerDesktopIcon, TrashIcon, FolderArrowDownIcon, VideoCameraIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Code, Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from './LinksGroup';
// import Logo from 'app/assets/react.svg'

import classes from './Sidebar.module.css';

const mockdata = [
  { label: 'Desktop', icon: ComputerDesktopIcon },
  {
    label: 'Documents',
    icon: DocumentTextIcon,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Downloads',
    icon: FolderArrowDownIcon,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  {
    label: 'Pictures',
    icon: PhotoIcon,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Trash', icon: TrashIcon },
  {
    label: 'Videos',
    icon: VideoCameraIcon,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
];

export function Sidebar() {
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          {/* <Logo style={{ width: 120 }} /> */}
          <Code fw={700}>Electviter</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

    </nav>
  );
}