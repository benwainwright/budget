import { DragIndicator, Event } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { AddDateDialog } from "./add-date-dialog";
import { BudgetEntry } from "../types/budget-entry";

interface BudgetEntryItemProps {
  index: number;
  date: BudgetEntry;
  dates: BudgetEntry[];
  isFinal: boolean;
  payday: Date;
  onEdit: (date: BudgetEntry) => void;
  onDelete: () => void;
}

const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  background: isDragging ? "lightgreen" : "none",

  ...draggableStyle,
});

export const BudgetEntryItem: FC<BudgetEntryItemProps> = (props) => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      {showEdit && (
        <AddDateDialog
          current={props.date}
          payday={props.payday}
          onSubmit={(date: BudgetEntry) => {
            props.onEdit(date);
            setShowEdit(false);
          }}
          id={props.date.potId}
          onDelete={props.onDelete}
          onClose={() => {
            setShowEdit(false);
          }}
        />
      )}
      <Draggable draggableId={props.date.id} index={props.index}>
        {(draggableProvided, snapshot) => (
          <ListItem
            dense
            divider={!props.isFinal}
            onClick={() => setShowEdit(true)}
            alignItems="flex-start"
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            style={{
              ...getItemStyle(
                snapshot.isDragging,
                draggableProvided.draggableProps.style
              ),
              userSelect: "none",
            }}
            disablePadding
          >
            <ListItemButton
              dense
              alignItems="flex-start"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListItemIcon
                sx={{
                  margin: 0,
                  minWidth: 30,
                }}
              >
                <DragIndicator />
              </ListItemIcon>
              <ListItemText
                disableTypography
                sx={{
                  margin: 0,
                  display: "flex",
                  flexDirection: "row",
                }}
                primary={
                  <>
                    <Typography>
                      <strong>{props.date.name}</strong>
                      {props.date.name ? ": " : ""}
                      {formatter.format(Number(props.date.amount))}{" "}
                      {props.date.when}
                    </Typography>
                    {props.dates
                      .filter((date) => date.when)
                      .map(() => (
                        <Event
                          sx={{
                            margin: 0,
                          }}
                        />
                      ))}
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        )}
      </Draggable>
    </>
  );
};
