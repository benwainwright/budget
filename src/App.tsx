import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Pots } from "./Pots";
import { AppBar, Container, Typography } from "@mui/material";
import { usePots } from "./use-pots";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  const { data } = usePots();
  console.log(data);

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ width: 800 }}>
          <AppBar color="primary" style={{ top: 0, padding: 10 }}>
            <Typography variant="h2" component="h1">
              Budget
            </Typography>
          </AppBar>
          <Box style={{ paddingTop: 100 }}>
            <Pots />
          </Box>

          <AppBar
            position="fixed"
            color="primary"
            style={{ top: "auto", bottom: 0 }}
          >
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
              <BottomNavigationAction
                label="Favorites"
                icon={<FavoriteIcon />}
              />
              <BottomNavigationAction
                label="Nearby"
                icon={<LocationOnIcon />}
              />
            </BottomNavigation>
          </AppBar>
        </Box>
      </LocalizationProvider>
    </Container>
  );
}
