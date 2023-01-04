import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid/Grid";
import Avatar from "@mui/material/Avatar/Avatar";
import Typography, {
  TypographyProps,
} from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { ScoreRecordType } from "../../types";
import ExternalLink from "../ExternalLink";
import React from "react";
import useIsMediumScreen from "../../hooks/useIsMediumScreen";

type LeaderboardScoreProps = {
  userScore: ScoreRecordType;
  isLast: boolean;
  rank: number;
};

const LeaderboardScore: React.FC<LeaderboardScoreProps> = ({
  userScore,
  isLast,
  rank,
}) => {
  const isMediumScreen = useIsMediumScreen();

  const textProps: TypographyProps = {
    color: "textPrimary",
    variant: isMediumScreen ? "h6" : "body1",
  };

  const { username, quizMutuals, score, userProfileImageUrl } = userScore;

  const cellSx: SxProps<Theme> = {
    borderBottom: isLast ? "none" : "solid 1px",
    borderRight: "solid 1px",
    borderColor: "primary.main",
    p: 1,
    minHeight: 50,
    display: "flex",
    alignItems: "center",
  };

  const rightmostCellSx: SxProps<Theme> = {
    borderRight: "none",
  };

  return (
    <>
      <Grid item xs={1} sx={{ ...cellSx }}>
        <Typography {...textProps}>{rank}</Typography>
      </Grid>
      <Grid item xs={5} sx={{ ...cellSx }}>
        <ExternalLink href={`https://twitter.com/${username}`}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMediumScreen ? "flex-start" : "center",
              flexDirection: isMediumScreen ? "row" : "column",
            }}
          >
            <Avatar
              alt={`${username} profile image`}
              src={userProfileImageUrl}
              sx={{ mr: 1, height: 25, width: 25 }}
            />
            <Typography {...textProps} color="primary">
              {`@${username}`}
            </Typography>
          </Box>
        </ExternalLink>
      </Grid>
      <Grid item xs={4} sx={{ ...cellSx }}>
        <Typography sx={{ display: "flex", flexWrap: "wrap" }}>
          {quizMutuals.map((mutual, i) => (
            <React.Fragment key={mutual}>
              <ExternalLink href={`https://twitter.com/${mutual}`}>
                <Typography
                  sx={{}}
                  color="primary"
                  display="inline"
                  component="span"
                >
                  {`${mutual}`}
                </Typography>
              </ExternalLink>
              {i !== quizMutuals.length - 1 && (
                <Typography sx={{}} display="inline" component="span">
                  ,&nbsp;
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Typography>
      </Grid>
      <Grid item xs={2} sx={{ ...cellSx, ...rightmostCellSx }}>
        <Typography sx={{}} {...textProps}>
          {score}
        </Typography>
      </Grid>
    </>
  );
};

export default LeaderboardScore;
