import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { FLEX_COLUMN } from "../../styles";
import { useAppSelector } from "../../redux/store";
import {
  selectQuizMutuals,
  selectScore,
  selectUserHandle,
  selectUserRank,
} from "../../redux/selectors";
import { getOrdinalSuffix } from "../../utils";
import useLogQuizEvent from "../../hooks/useLogEvent";

type TwitterShareButtonProps = {};

const TwitterShareButton: React.FC<TwitterShareButtonProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
  };

  const quizMutuals = useAppSelector(selectQuizMutuals);
  const score = useAppSelector(selectScore);
  const rank = useAppSelector(selectUserRank);
  const username = useAppSelector(selectUserHandle);
  const logEvent = useLogQuizEvent();

  let scoreText = `scored ${score}`;

  if (rank) {
    scoreText = `ranked ${getOrdinalSuffix(rank)}`;
  }

  const handleClick = () => {
    const quizMutualsString = quizMutuals
      .map((mutual, i) => {
        let prefix = ", ";

        if (i === 0) {
          prefix = "";
        }

        if (i === quizMutuals.length - 1) {
          prefix = ", and ";
        }

        return `${prefix}${mutual}`;
      })
      .join("");

    const text = `Just ${scoreText} on the Twitter Friends Challenge, with tweets from ${quizMutualsString}. Try to beat my score!`;

    // Opens a pop-up with twitter sharing dialog
    var shareURL = "http://twitter.com/share?"; //url base
    //params
    var params: { [key: string]: string } = {
      url: "https://www.TwitterFriendsChallenge.com",
      text: text,
      // via: "Twitter",
      hashtags: "TwitterFriendsChallenge",
    };

    for (var prop in params) {
      shareURL += "&" + prop + "=" + encodeURIComponent(params[prop]);
    }

    window.open(
      shareURL,
      "",
      "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0"
    );

    logEvent("openTweet", { text, username });
  };

  return (
    <Box sx={sx}>
      <Typography color="primary" variant="h6" sx={{ mb: 1 }}>
        Challenge them to beat your score
      </Typography>
      <Button
        onClick={handleClick}
        color="success"
        size="large"
        variant="contained"
      >
        Challenge Friends
      </Button>
    </Box>
  );
};

export default TwitterShareButton;
