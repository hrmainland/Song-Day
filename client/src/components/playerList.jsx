import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Divider,
  Paper,
  ListItemText,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";


export default function PlayerList({
  nameMap,
  userId,
  hostId,
  emptyMessage,
  bgColorHover,
  dotColor,
  title,
}) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="subtitle1"
        color="text.primary"
        fontWeight="700"
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
        }}
      >
        <Box
          component="span"
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: dotColor,
            display: "inline-block",
            mr: 0.8,
          }}
        />
        {title} ({nameMap.size})
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <List
          sx={{
            bgcolor: "background.paper",
            maxHeight: "200px",
            overflow: "auto",
            p: 0,
          }}
        >
          {[...nameMap.keys()].map((id, index) => (
            <React.Fragment key={index}>
              <ListItem
                dense
                sx={{
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: bgColorHover,
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      userId === hostId && id === hostId
                        ? "primary.main"
                        : "rgba(0, 0, 0, 0.08)",
                    width: 36,
                    height: 36,
                    mr: 1.5,
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={
                        userId === hostId && id === hostId ? 600 : 400
                      }
                    >
                      {nameMap.get(id)}
                    </Typography>
                  }
                />
              </ListItem>
              {index < nameMap.size - 1 && (
                <Divider component="li" variant="inset" />
              )}
            </React.Fragment>
          ))}
          {nameMap.size === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    color={emptyMessage.color || "text.secondary"}
                    fontWeight={emptyMessage.fontWeight || 400}
                    sx={{ py: 1 }}
                  >
                    {emptyMessage.text}
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}
