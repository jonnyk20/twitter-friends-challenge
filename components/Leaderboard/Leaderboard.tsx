import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid/Grid";
import Typography, {
  TypographyProps,
} from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import ContestScore from "./LeaderboardScore";
import { useAppSelector } from "../../redux/store";
import { selectScoreRecords } from "../../redux/selectors";

type LeaderboardProps = {};

const Leaderboard: React.FC<LeaderboardProps> = () => {
  const sx: SxProps<Theme> = {
    mt: 1,
    maxWidth: 800,
    position: "relative",
  };

  const boardSx: SxProps<Theme> = {
    border: "solid 1px",
    borderColor: "primary.main",
    maxHeight: 300,
    overflowY: "scroll",
    // bottom shadow to indicate scroll
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 20,
      background: "linear-gradient(rgba(255,255,255,0), #00000087)",
    },
  };

  const headerCellSx: SxProps<Theme> = {
    borderBottom: "solid 1px",
    borderRight: "solid 1px",
    borderColor: "primary.main",
    p: 1,
  };

  const rightMostCellSx: SxProps<Theme> = {
    borderRight: "none",
  };

  const headerTextProps: TypographyProps = {
    color: "primary",
    fontWeight: "bold",
    variant: "h5",
  };

  const scores = useAppSelector(selectScoreRecords);

  return (
    <Box sx={sx}>
      <Typography align="center" variant="h5" color="primary" sx={{ mb: 2 }}>
        Top Twitter Friends
      </Typography>
      <Box sx={boardSx}>
        <Grid container>
          <Grid item xs={1}>
            <Typography sx={{ ...headerCellSx }} {...headerTextProps}>
              #
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography sx={{ ...headerCellSx }} {...headerTextProps}>
              Name
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ ...headerCellSx }} {...headerTextProps}>
              Mutuals
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              sx={{ ...headerCellSx, ...rightMostCellSx }}
              {...headerTextProps}
            >
              Score
            </Typography>
          </Grid>
          {scores.map((userScore, i) => (
            <ContestScore
              rank={i + 1}
              key={`${userScore.username} ${i}`}
              userScore={userScore}
              isLast={i === scores.length - 1}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Leaderboard;
