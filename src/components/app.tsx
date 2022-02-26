import Box from "@mui/material/Box";
import { Budget } from "./budget";
import { Settings } from "./settings";
import { Routes, Route } from "react-router-dom";
import {
  AppBar,
  Typography,
} from "@mui/material";
import { BottomBar } from "./bottom-bar";

export default function SimpleBottomNavigation() {
  return (
    <>
      <AppBar color="primary" style={{ top: 0, padding: 10 }}>
        <Typography variant="h2" component="h1">
          Budget
        </Typography>
      </AppBar>
      <Box style={{ paddingTop: 100 }}>
        <Routes>
          <Route path="/" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
      <BottomBar />
    </>
  );
}
