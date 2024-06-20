import { FC, SVGProps } from "react";

export const MinizarIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 7L7 1L13 7"
      stroke="#1A71FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
