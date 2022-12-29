import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { resetTwitterChallengeState } from "../redux/quizSlice";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { FLEX_COLUMN } from "../styles";
import { selectError } from "../redux/selectors";

type TwitterChallengeErrorDisplayProps = {};

const TwitterChallengeErrorDisplay: React.FC<
  TwitterChallengeErrorDisplayProps
> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
  };

  const errorMessage = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  const onClickReset = () => {
    dispatch(resetTwitterChallengeState());
  };

  return (
    <Box sx={sx}>
      <Typography color="testPrimary" variant="h5">
        Something Went Wrong
      </Typography>
      <Typography color="error">{errorMessage}</Typography>
      <Button onClick={onClickReset} color="primary">
        Try Again
      </Button>
    </Box>
  );
};

export default TwitterChallengeErrorDisplay;
