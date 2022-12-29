import Box from "@mui/material/Box/Box";
import Stack from "@mui/material/Stack/Stack";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { ReactNode, useEffect } from "react";

import MutualsSearchInput from "./MutualsSearchInput";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  selectHasMutualsFound,
  selectHasError,
  selectIsMutualsSearchPending,
  selectIsQuizFinished,
  selectIsMutualsSearchNotStarted,
} from "../redux/selectors";
import MutualsSelection from "./MutualsSelection";
import TwitterChallengeErrorDisplay from "./TwitterChallengeErrorDisplay";
import LoadingDisplay from "./LoadingDisplay";
import { FLEX_COLUMN } from "../styles";
import {
  selectIsQuizGenerationPending,
  selectIsQuizGenerationSuccessful,
} from "../redux/selectors";
import Quiz from "./Quiz/Quiz";
import { resetTwitterChallengeState } from "../redux/quizSlice";
import { logEvent } from "../analytics";
import useLeaderBoard from "../hooks/useLeaderBoard";
import Leaderboard from "./Leaderboard/Leaderboard";
import AppInfo from "./AppInfo";
import useLogQuizEvent from "../hooks/useLogEvent";

type TwitterChallengeProps = {};

const TwitterChallenge: React.FC<TwitterChallengeProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
    p: 1,
    pt: 3,
    maxWidth: 800,
    m: "auto",
  };

  const hasMutualsFound = useAppSelector(selectHasMutualsFound);
  const hasError = useAppSelector(selectHasError);
  const isProcessPending = useAppSelector(selectIsMutualsSearchPending);

  const isQuizLoading = useAppSelector(selectIsQuizGenerationPending);
  const isQuizReady = useAppSelector(selectIsQuizGenerationSuccessful);
  const isQuizCompleted = useAppSelector(selectIsQuizFinished);
  const isMutualsSearchNotStarted = useAppSelector(
    selectIsMutualsSearchNotStarted
  );
  const logEvent = useLogQuizEvent();

  useEffect(() => {
    logEvent("pageViewed");
  }, []);

  const shouldShowLeaderBoard = isQuizCompleted || isMutualsSearchNotStarted;

  const dispatch = useAppDispatch();
  useLeaderBoard();

  const handleClickReset = () => {
    dispatch(resetTwitterChallengeState());
    logEvent("resetQuizState");
  };

  const QuizClearButton = (
    <>
      {isQuizReady && (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={handleClickReset}
            size="small"
            sx={{ margin: "auto", mt: 6 }}
          >
            Clear and start again
          </Button>
        </Box>
      )}
    </>
  );

  let Content: ReactNode = <MutualsSearchInput />;

  if (hasMutualsFound) {
    Content = <MutualsSelection />;
  }

  if (isProcessPending) {
    Content = <LoadingDisplay text="Please wait.." />;
  }

  if (isQuizLoading) {
    Content = (
      <LoadingDisplay text="Preparing Quiz (Should take less than 30 seconds)..." />
    );
  }

  if (isQuizReady) {
    Content = <Quiz />;
  }

  if (hasError) {
    Content = <TwitterChallengeErrorDisplay />;
  }

  return (
    <Stack sx={sx} spacing={1}>
      <Typography variant="h5" color="primary">
        Twitter Friends Challenge
      </Typography>
      {Content}
      {QuizClearButton}
      {shouldShowLeaderBoard && <Leaderboard />}
      <AppInfo />
    </Stack>
  );
};

export default TwitterChallenge;
