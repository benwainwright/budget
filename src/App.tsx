import * as React from "react";
import Box from "@mui/material/Box";
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
        <Box>
          <AppBar color="primary" style={{ top: 0, padding: 10 }}>
            <Typography variant="h2" component="h1">
              Budget
            </Typography>
          </AppBar>
          <Box style={{ paddingTop: 100 }}>
            <Pots />
          </Box>
        </Box>
      </LocalizationProvider>
    </Container>
  );
}
