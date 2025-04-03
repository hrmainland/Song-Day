import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  tooltipClasses,
  AlertTitle,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PlayerList from "./playerList";

export default function PlayerProgressPaper({
  title,
  nameMap,
  submitterIds,
  userId,
  hostId,
}) {
  const participantCount = submitterIds.length;
  const expectedParticipants = nameMap.size;
  // console.log('nameMap :>> ', nameMap);

  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "16px",
        background: "linear-gradient(145deg, #ffffff, #f0f7ff)",
        mb: 3.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PersonIcon /> {title}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="700"
          color="primary.main"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 2,
            py: 0.5,
            borderRadius: "20px",
            bgcolor: "rgba(25, 118, 210, 0.1)",
          }}
        >
          {participantCount}{" "}
          <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
            of
          </Typography>{" "}
          {expectedParticipants}
        </Typography>
      </Box>

      <Box sx={{ mb: 3.5, position: "relative", pt: 0.5 }}>
        <Box
          sx={{
            height: "12px",
            bgcolor: "rgba(0, 0, 0, 0.04)",
            borderRadius: "6px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${
                (participantCount / Math.max(expectedParticipants, 1)) * 100
              }%`,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              borderRadius: "6px",
              transition: "width 0.5s ease-in-out",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3, opacity: 0.7 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
        }}
      >
        <PlayerList
          nameMap={
            new Map(
              [...nameMap].filter(([id, name]) => submitterIds.includes(id))
            )
          }
          userId={userId}
          hostId={hostId}
          title="Submitted Players"
          dotColor="success.main"
          bgColorHover="rgba(25, 118, 210, 0.04)"
          emptyMessage={{
            text: "No players have submitted yet",
            color: "text.secondary",
            fontWeight: 400,
          }}
        />

        <PlayerList
          nameMap={
            new Map(
              [...nameMap].filter(([id, name]) => !submitterIds.includes(id))
            )
          }
          userId={userId}
          hostId={hostId}
          title="Waiting on Players"
          dotColor="warning.main"
          bgColorHover="rgba(255, 152, 0, 0.04)"
          emptyMessage={{
            text: "All players have submitted",
            color: "success.main",
            fontWeight: 500,
          }}
        />
      </Box>
    </Paper>
  );
}
