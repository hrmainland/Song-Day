import { Paper } from "@mui/material";

export default function TopContainer({children}) {
    return (
        <>
        <Paper
        sx={{
            width: "100%",
            height: "20%",
            paddingTop: { xs: "0.1rem", sm: "0.1rem" },
            paddingBottom: { xs: "0.2rem", sm: "0.2rem" },
            paddingLeft: { xs: "2rem", sm: "4rem" },
            paddingRight: { xs: "2rem", sm: "4rem" },
            
            top: 0,
            left: 0,
            zIndex: -1
        }}
        >
            {children}
        </Paper>
        </>
    );
}