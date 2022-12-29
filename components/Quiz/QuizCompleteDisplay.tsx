import Box from "@mui/material/Box/Box";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import {
  selectScore,
  selectSelectedMutuals,
  selectUserRank,
} from "../../redux/selectors";
import { useAppSelector } from "../../redux/store";
import { FLEX_COLUMN } from "../../styles";
import TwitterUser from "../TwitterUser";
import TwitterShareButton from "./TwitterShareButton";
import AppInfo from "../AppInfo";
import Leaderboard from "../Leaderboard/Leaderboard";

type QuizCompleteDisplayProps = {};

const QuizCompleteDisplay: React.FC<QuizCompleteDisplayProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
    pt: 2,
  };

  const score = useAppSelector(selectScore);
  const selectedMutuals = useAppSelector(selectSelectedMutuals);
  const rank = useAppSelector(selectUserRank);

  return (
    <Stack sx={sx} spacing={1}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Typography color="textPrimary" variant="h6" sx={{ mr: 1 }}>
          Score:
        </Typography>
        <Typography color="primary" variant="h6" fontWeight="bold">
          {score}
        </Typography>
        <Typography color="textPrimary" variant="h6" sx={{}}>
          ,&nbsp;Rank:&nbsp;
        </Typography>
        <Typography color="primary" variant="h6" fontWeight="bold">
          {`#${rank}`}
        </Typography>
      </Box>
      <Typography color="primary" variant="body1">
        Base on tweets by:
      </Typography>
      <Stack spacing={1} direction={{ xs: "row", sm: "row" }} sx={{ mb: 2 }}>
        {selectedMutuals.map((user) => (
          <TwitterUser key={user.id} user={user} />
        ))}
      </Stack>
      <TwitterShareButton />
    </Stack>
  );
};

export default QuizCompleteDisplay;
