import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import Button from "@mui/material/Button/Button";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { startQuiz, startTimer } from "../../redux/quizSlice";
import { selectGeneratedQuestionsCount } from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FLEX_COLUMN } from "../../styles";

type QuizStartProps = {};

const QuizStart: React.FC<QuizStartProps> = () => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
    width: "100%",
    pt: 4,
  };
  const dispatch = useAppDispatch();
  const generatedQuestionsCount = useAppSelector(selectGeneratedQuestionsCount);

  const title = `See how well you know your mutuals`;

  const handleClick = () => {
    dispatch(startQuiz());
    dispatch(startTimer());
  };

  return (
    <Box sx={sx}>
      <Typography align="center" variant="h4" color="primary" sx={{ mb: 2 }}>
        Ready!
      </Typography>
      <Typography
        variant="h4"
        align="center"
        color="primary"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textPrimary"
        sx={{ mb: 2 }}
      >
        {`${generatedQuestionsCount} questions`}
      </Typography>
      <Button size="large" onClick={handleClick} variant="contained" fullWidth>
        Start Challenge
      </Button>
    </Box>
  );
};

export default QuizStart;
