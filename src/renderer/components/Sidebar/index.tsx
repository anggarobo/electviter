import { ComputerDesktopIcon, FolderIcon, TrashIcon, FolderArrowDownIcon, VideoCameraIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Code, Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from './LinksGroup';
// import Logo from 'app/assets/react.svg'

import classes from './Sidebar.module.css';
import { useEffect, useState } from 'react';
import type { Directory } from './type';


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

export default function Sidebar() {
  const [links, setLinks] = useState<Directory[]>([])
  useEffect(() => {
      const dir = window.api.dir
      const directories = dir.map(d => ({
        ...d,
        icon: FolderIcon
      }))
      setLinks(directories)
  }, [])
  // const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          {/* <Logo style={{ width: 120 }} /> */}
          <Code fw={700}>Electviter</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          { links.map(link => <LinksGroup key={link.name} icon={link.icon} label={link.name} />) }
        </div>
      </ScrollArea>

    </nav>
  );
}