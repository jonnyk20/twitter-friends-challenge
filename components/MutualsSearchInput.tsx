import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField/TextField";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import TwitterIcon from "@mui/icons-material/Twitter";
import { setUserHandle, searchMutualsAsync } from "../redux/quizSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FLEX_COLUMN } from "../styles";
import {
  selectIsMutualsSearchPending,
  selectUserHandle,
} from "../redux/selectors";
import { useState } from "react";

type MutualsSearchInputProps = {};

const MutualsSearchInput: React.FC<MutualsSearchInputProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
  };
  const [hasChanged, setHasChanged] = useState(false);

  const dispatch = useAppDispatch();
  const userHandle = useAppSelector(selectUserHandle);
  const isProcessPending = useAppSelector(selectIsMutualsSearchPending);

  const handleChangeUserHandle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!hasChanged) {
      setHasChanged(true);
    }
    const updatedValue = event.target.value.replaceAll("@", "");
    dispatch(setUserHandle(updatedValue));
  };

  const handleClickSearch = () => {
    dispatch(searchMutualsAsync(userHandle));
  };

  const isButtonDisabled = !userHandle || isProcessPending;

  const hasInput = !!userHandle;

  let inputValue = userHandle;

  if (hasChanged) {
    inputValue = "@" + userHandle;
  }

  return (
    <Box sx={sx}>
      <Typography>See how well you know your Twitter friends</Typography>
      <Typography>First, enter your Twitter username</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <TwitterIcon color="primary" sx={{ mr: 1 }} />

        <TextField
          value={inputValue}
          onChange={handleChangeUserHandle}
          placeholder="@YourTwitterHandle"
          size="small"
        />
      </Box>
      {hasInput && (
        <Button
          variant="contained"
          onClick={handleClickSearch}
          disabled={isButtonDisabled}
        >
          Find my Twitter Friends
        </Button>
      )}
    </Box>
  );
};

export default MutualsSearchInput;
