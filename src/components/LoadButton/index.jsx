import { Box, IconButton, styled, Typography } from "@mui/material";
import React from "react";

// props
// onClick: VoidFunc

const Container = styled(Box)({
    border: "2px solid",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
});

const LoadButton = (props) => {
    return (
        <IconButton onClick={props.onClick}>
            <Container>
                <Typography variant="h6">LOAD THIS ANNOTATION</Typography>
            </Container>
        </IconButton>
    );
};

export default LoadButton;
