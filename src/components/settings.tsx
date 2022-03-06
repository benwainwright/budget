import { DatePicker } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { FC, useContext } from "react";
import { SettingsContext } from "../providers/settings-provider";

export const Settings: FC = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  return (
    <>
      <Typography variant="h1" component="h2">
        Settings
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <TextField
          id="outlined-basic"
          label="Overdraft Limit"
          variant="outlined"
          onChange={(event) =>
            setSettings({
              ...settings,
              overdraft: Number(event.target.value),
            })
          }
          value={settings.overdraft}
        />
        <DatePicker
          label="Next Payday"
          value={settings.nextPayday}
          onChange={(newValue) => {
            setSettings({
              ...settings,
              nextPayday: newValue ?? undefined,
            });
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </>
  );
};
