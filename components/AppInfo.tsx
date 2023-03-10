import Box from "@mui/material/Box/Box";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import ExternalLink from "./ExternalLink";
import { FLEX_COLUMN } from "../styles";
import Typography from "@mui/material/Typography/Typography";

type AppInfoProps = {};

const AppInfo: React.FC<AppInfoProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
    pt: 6,
  };

  return (
    <Box sx={sx}>
      <Typography variant="h6" color="textPrimary">
        About
      </Typography>

      <Typography
        display="inline"
        align="center"
        variant="body2"
        fontWeight="bold"
        color="textPrimary"
        sx={{ mt: 2 }}
      >
        Source Code:&nbsp;
        <ExternalLink href="https://github.com/jonnyk20/twitter-friends-challenge">
          <Typography
            color="primary"
            display="inline"
            variant="body2"
            fontWeight="bold"
            component="span"
          >
            Github
          </Typography>
        </ExternalLink>
      </Typography>
      <Typography
        display="inline"
        align="center"
        variant="body2"
        fontWeight="bold"
        color="textPrimary"
      >
        Creator (dm me if you find bugs):&nbsp;
        <ExternalLink href="https://www.twitter.com/jonnykalambay">
          <Typography
            color="primary"
            display="inline"
            variant="body2"
            fontWeight="bold"
            component="span"
          >
            Jonny Kalambay
          </Typography>
        </ExternalLink>
      </Typography>
      <Typography
        display="inline"
        align="center"
        variant="body2"
        sx={{ mt: 2 }}
      >
        Lastly, if generating quizzes from online content is something
        you&apos;d like to do more of, check out:&nbsp;
        <ExternalLink href="https://www.roshi.ai/activities">
          <Typography
            color="primary"
            display="inline"
            variant="body2"
            fontWeight="bold"
            component="span"
          >
            Roshi.ai
          </Typography>
        </ExternalLink>
        .
      </Typography>
    </Box>
  );
};

export default AppInfo;
