import Box from "@mui/material/Box/Box";
import React, { ReactElement, CSSProperties } from "react";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

type PropsType = {
  href: string;
  children: ReactElement | string;
  onClick?: () => void;
  shouldOpenOnSamePage?: boolean;
  styles?: CSSProperties;
  sx?: SxProps<Theme>;
};

const ExternalLink: React.FC<PropsType> = ({
  href,
  children,
  styles = {},
  sx = {},
  onClick,
  shouldOpenOnSamePage,
}) => {
  const mergedStyles: CSSProperties = {
    color: "inherit",
    textDecoration: "none",
    ...styles,
  };

  let linkBehaviorProps: { target?: string; rel?: string } = {
    rel: "noopener noreferrer",
    target: "_blank",
  };

  if (shouldOpenOnSamePage) {
    linkBehaviorProps = {};
  }

  return (
    <Box
      sx={sx}
      style={mergedStyles}
      href={href}
      onClick={onClick}
      {...linkBehaviorProps}
      component="a"
    >
      {children}
    </Box>
  );
};

export default ExternalLink;
