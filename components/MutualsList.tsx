import Box from "@mui/material/Box/Box";
import Stack from "@mui/material/Stack/Stack";
import { FixedSizeList as List } from "react-window";

import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { TwitterUserType } from "../types";
import { selectSelectedMutualIds } from "../redux/selectors";
import { useAppSelector } from "../redux/store";
import SelectableTwitterUser from "./SelectableTwitterUser";

type MutualsListProps = {
  mutuals: TwitterUserType[];
};

const MutualsList: React.FC<MutualsListProps> = ({ mutuals }) => {
  const sx: SxProps<Theme> = {
    // p: 1,

    mt: 1,
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

  const selectedMutualIds = useAppSelector(selectSelectedMutualIds);

  const itemCount = mutuals.length;
  const itemHeight = 70;

  const Cell = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    // const itemNumber = columnIndex + rowIndex + 1;

    const styles = {
      ...style,
    };

    const user: TwitterUserType = mutuals[index];

    return (
      <Box style={styles}>
        {!!user && (
          <SelectableTwitterUser
            key={user.id}
            user={user}
            isSelected={selectedMutualIds.includes(user.id)}
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={sx}>
      <Stack direction="column" spacing={1}>
        <Box
          sx={{
            border: "solid 1px",
            borderColor: "primary.light",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <List
            height={400}
            itemCount={itemCount}
            itemSize={itemHeight}
            width={300}
          >
            {Cell}
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default MutualsList;
