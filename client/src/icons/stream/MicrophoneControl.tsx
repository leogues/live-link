import { FC, SVGProps } from 'react';

export const MicrophoneControlIcon: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.6668 14.1498V9H14H9.3335V13.7102L12.9857 17.6667H15.4205L18.6668 14.1498Z"
      fill="currentColor"
    />
    <path
      d="M14.0002 18.0833C16.5785 18.0833 18.6668 15.995 18.6668 13.4166V6.99998C18.6668 4.42165 16.5785 2.33331 14.0002 2.33331C11.4218 2.33331 9.3335 4.42165 9.3335 6.99998V13.4166C9.3335 15.995 11.4218 18.0833 14.0002 18.0833Z"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.07568 11.2584V13.2417C5.07568 18.165 9.07735 22.1667 14.0007 22.1667C18.924 22.1667 22.9257 18.165 22.9257 13.2417V11.2584"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 22.1667V25.6667"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
