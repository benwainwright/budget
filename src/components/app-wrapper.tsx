import { Box, Container } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { FC, useState } from "react";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Settings, SettingsContext } from "../settings-context";

export const AppWrapper: FC = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    overdraft: 0,
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <Container>
        <Router>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ marginBottom: 10 }}>{children}</Box>
          </LocalizationProvider>
        </Router>
      </Container>
    </SettingsContext.Provider>
  );
};
