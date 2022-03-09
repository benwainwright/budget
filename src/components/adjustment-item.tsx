import { DragIndicator } from "@mui/icons-material";
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
import { Adjustment } from "../types/budget";
import { AddAdjustmentDialog } from "./add-adjustment-item";

interface AdjustmentItemProps {
  index: number;
  adjustment: Adjustment;
  isFinal: boolean;
  payday: Date;
  onEdit: (date: Adjustment) => void;
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

export const AdjustmentItem: FC<AdjustmentItemProps> = ({
  adjustment,
  onEdit,
  onDelete,
  isFinal,
  index,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      {showEdit && (
        <AddAdjustmentDialog
          id={adjustment.id}
          current={adjustment}
          onDelete={onDelete}
          onSubmit={onEdit}
          onClose={() => setShowEdit(false)}
        />
      )}
      <Draggable draggableId={adjustment.id} index={index}>
        {(draggableProvided, snapshot) => (
          <ListItem
            dense
            onClick={() => setShowEdit(true)}
            divider={!isFinal}
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
                      <strong>{adjustment.name}</strong>
                      {adjustment.name ? ": " : ""}
                      {formatter.format(Number(adjustment.amount))}{" "}
                      {adjustment.date?.toString()}
                    </Typography>
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
