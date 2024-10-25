const IconEyeOpen = ({
  width = "24px",
  height = "25px",
  color = "var(--colorBlueDark)",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
    >
      <g clipPath="url(#clip0_1067_8762)">
        <path
          d="M12 5.75C4.5 5.75 1.5 12.5 1.5 12.5C1.5 12.5 4.5 19.25 12 19.25C19.5 19.25 22.5 12.5 22.5 12.5C22.5 12.5 19.5 5.75 12 5.75Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15.5C13.6569 15.5 15 14.1569 15 12.5C15 10.8431 13.6569 9.5 12 9.5C10.3431 9.5 9 10.8431 9 12.5C9 14.1569 10.3431 15.5 12 15.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1067_8762">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconEyeOpen;
