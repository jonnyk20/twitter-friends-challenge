import Box from "@mui/material/Box/Box";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import { TwitterUserType } from "../types";
import { ROUNDED_BLUE_BORDER } from "../styles";

type TwitterUserProps = {
  user: TwitterUserType;
};

const TwitterUser: React.FC<TwitterUserProps> = ({ user }) => {
  const sx: SxProps<Theme> = {
    width: "100%",
    display: "flex",
    alignItems: "center",
  };

  const { username } = user;

  const formattedUsername = `@${username}`;

  return (
    <Box sx={sx}>
      <Typography color="textPrimary">{formattedUsername}</Typography>
    </Box>
  );
};

export default TwitterUser;
