import { XMarkIcon, StopIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameWindowAction('CLOSE')}
      >
        <XMarkIcon color='#000' />
        
      </button>
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameWindowAction('MINIMIZE')}
      >
        <MinusIcon color='#000' />
      </button>
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameWindowAction('MAXIMIZE')}
      >
        <StopIcon color='#000' />
      </button>
    </header>
  );
}