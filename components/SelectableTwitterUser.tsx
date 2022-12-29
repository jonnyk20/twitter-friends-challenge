import Card from "@mui/material/Card/Card";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { TwitterUserType } from "../types";
import {
  addToSelectedMutuals,
  removeFromSelectedMutuals,
} from "../redux/quizSlice";
import { useAppDispatch } from "../redux/store";

type SelectableTwitterUserProps = {
  user: TwitterUserType;
  isSelected: boolean;
};

const SelectableTwitterUser: React.FC<SelectableTwitterUserProps> = ({
  user,
  isSelected,
}) => {
  const sx: SxProps<Theme> = {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 1,
    mb: 1,
    border: "solid 2px",
    borderColor: isSelected ? "primary.main" : "transparent",
  };

  const { username, profileImageUrl } = user;

  const dispatch = useAppDispatch();

  const selectUser = () => {
    dispatch(addToSelectedMutuals(user));
  };

  const deselectUser = () => {
    dispatch(removeFromSelectedMutuals(user.id));
  };

  const handleClick = () => {
    isSelected ? deselectUser() : selectUser();
  };

  const formattedUsername = `@${username}`;

  const color: "inherit" | "primary" = isSelected ? "primary" : "inherit";

  return (
    <Card sx={sx} onClick={handleClick} elevation={5}>
      <Avatar alt={`${username} profile image`} src={profileImageUrl} />
      <Typography
        color={color}
        variant="h6"
        fontWeight={isSelected ? "bold" : "normal"}
      >
        {formattedUsername}
      </Typography>
      <CheckCircleIcon
        fontSize="small"
        color={color}
        sx={{ visibility: isSelected ? "initial" : "hidden" }}
      />
    </Card>
  );
};

export default SelectableTwitterUser;
