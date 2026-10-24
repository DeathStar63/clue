import './ui.css';
import type { ReactNode } from 'react';

export type IconName =
  | 'back' | 'chevron' | 'close' | 'check' | 'alert' | 'info' | 'camera' | 'image' | 'share'
  | 'plus' | 'trash' | 'doctor' | 'flask' | 'clock' | 'list' | 'sparkle' | 'body';

const PATHS: Record<IconName, ReactNode> = {
  back: <path d="M15 5l-7 7 7 7" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3.5L2.8 19.5h18.4L12 3.5z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.1" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.5A1.5 1.5 0 015 7h2.5L9 5h6l1.5 2H19a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5v-9z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l4.5-4.5 3.5 3.5 2.5-2.5L20 19" />
    </>
  ),
  share: (
    <>
      <path d="M12 3.5v11M8 7l4-3.5L16 7" />
      <path d="M7 10.5H6a1.5 1.5 0 00-1.5 1.5v7A1.5 1.5 0 006 20.5h12a1.5 1.5 0 001.5-1.5v-7a1.5 1.5 0 00-1.5-1.5h-1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5h5v2" />
      <path d="M6.5 7l.8 12a1.5 1.5 0 001.5 1.4h6.4a1.5 1.5 0 001.5-1.4l.8-12" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  doctor: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M5 20.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
      <path d="M12 15.5v3M10.5 17h3" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3.5h5M10 3.5v6L4.8 18.2A1.5 1.5 0 006.1 20.5h11.8a1.5 1.5 0 001.3-2.3L14 9.5v-6" />
      <path d="M7.5 14.5h9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  list: <path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5v.1M4.5 12v.1M4.5 17.5v.1" />,
  sparkle: (
    <>
      <path d="M12 3.5l1.9 5.4 5.6 1.9-5.6 1.9L12 18.1l-1.9-5.4-5.6-1.9 5.6-1.9L12 3.5z" />
      <path d="M18.5 16v4M16.5 18h4" />
    </>
  ),
  body: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M5 8.5h14M12 8.5v6M9 21l3-6.5 3 6.5" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22 }: IconProps) {
  return (
    <svg
      className="ui-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
