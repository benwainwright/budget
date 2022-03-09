import { DatePicker } from "@mui/lab";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useContext } from "react";
import { usePots } from "../hooks/use-pots";
import { SettingsContext } from "../providers/settings-provider";

export const Settings: FC = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { data: pots } = usePots();
  return (
    <>
      <Typography variant="h1" component="h2">
        Settings
      </Typography>
      {pots && (
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
          <FormControl required>
            <InputLabel htmlFor="pot">Pot</InputLabel>
            <Select
              labelId="pot"
              id="pots"
              value={settings.surplusPot}
              label="Age"
              onChange={(event) =>
                setSettings({
                  ...settings,
                  surplusPot:
                    pots.pots.find((pot) => pot.id === event.target.value)
                      ?.id ?? "",
                })
              }
            >
              {pots.pots.map((pot) => (
                <MenuItem value={pot.id}>{pot.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </>
  );
};
