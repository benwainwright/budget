import { Box, Container } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { FC } from "react";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { SettingsProvider } from "../providers/settings-provider";

export const AppWrapper: FC = ({ children }) => (
  <SettingsProvider>
    <Container>
      <Router>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ marginBottom: 10 }}>{children}</Box>
        </LocalizationProvider>
      </Router>
    </Container>
  </SettingsProvider>
);
