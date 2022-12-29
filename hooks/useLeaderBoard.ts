import { useEffect } from "react";
import { setScoreRecords } from "../redux/quizSlice";
import { useAppDispatch } from "../redux/store";
import { getScores } from "../services/leaderboardService";

const useLeaderBoard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchScores = async () => {
      const fetchedScores = await getScores();
      dispatch(setScoreRecords(fetchedScores));
    };

    fetchScores();

    const interval = setInterval(fetchScores, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

export default useLeaderBoard;
