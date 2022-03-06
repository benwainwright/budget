import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import {
  CurrencyPound,
  Settings as SettingsIcon,
  Event,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BottomBar: FC = () => {
  const navigate = useNavigate();
  const [navChosen, setNavChosen] = useState(0);
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      color="primary"
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={navChosen}
        onChange={(_, newValue) => {
          setNavChosen(newValue);
        }}
      >
        <BottomNavigationAction
          onClick={() => navigate("/")}
          label="Budget"
          icon={<CurrencyPound />}
        />
        <BottomNavigationAction
          onClick={() => navigate("/settings")}
          label="Settings"
          icon={<SettingsIcon />}
        />

        <BottomNavigationAction
          onClick={() => navigate("/regular-payments")}
          label="Payments"
          icon={<Event />}
        />
      </BottomNavigation>
    </Paper>
  );
};
