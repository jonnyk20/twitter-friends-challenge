import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import {
  selectHasMutualsSelected,
  selectSelectedMutualIds,
  selectMutuals,
  selectQuizInput,
} from "../redux/selectors";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createQuizAsync } from "../redux/thunkActions";
import MutualsList from "./MutualsList";

type MutualsSelectionProps = {};

const MutualsSelection: React.FC<MutualsSelectionProps> = () => {
  const sx: SxProps<Theme> = {
    position: "relative",
  };

  const dispatch = useAppDispatch();
  const mutuals = useAppSelector(selectMutuals);
  const selectedMutualIds = useAppSelector(selectSelectedMutualIds);
  const hasMutualsSelected = useAppSelector(selectHasMutualsSelected);
  const twitterQuizInput = useAppSelector(selectQuizInput);

  const handleClickCreateTest = () => {
    dispatch(createQuizAsync(twitterQuizInput));
  };

  return (
    <Box sx={sx}>
      <Typography align="center">
        Which of these Twitter friends do you think you know best?
      </Typography>
      <Typography sx={{ mb: 3 }} align="center">
        Pick up to 3
      </Typography>
      <Button
        variant="contained"
        sx={{ mb: 1 }}
        disabled={!hasMutualsSelected}
        onClick={handleClickCreateTest}
        fullWidth
      >
        Create Quiz
      </Button>
      <MutualsList mutuals={mutuals} />
    </Box>
  );
};

export default MutualsSelection;
