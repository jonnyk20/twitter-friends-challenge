import { useEffect } from "react";
import { TIMER_INTERVAL } from "../constants";
import { tickTimer } from "../redux/quizSlice";
import {
  selectRemainingTimePortion,
  selectTimerStatus,
} from "../redux/selectors";
import { useAppDispatch, useAppSelector } from "../redux/store";

const useQuizTimer = () => {
  const dispatch = useAppDispatch();

  const remainingTimePortion = useAppSelector(selectRemainingTimePortion);
  const timerStatus = useAppSelector(selectTimerStatus);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timerStatus === "stopped") {
        clearTimeout(timeout);
        return;
      }

      if (remainingTimePortion <= 0) {
        clearTimeout(timeout);
        return;
      }
      if (remainingTimePortion <= 0) {
        clearTimeout(timeout);
        return;
      }

      dispatch(tickTimer());
    }, TIMER_INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTimePortion, timerStatus]);
};

export default useQuizTimer;
