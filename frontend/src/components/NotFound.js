import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
} from "@mui/material";
import { SearchOff, Home, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <SearchOff
            sx={{
              fontSize: 100,
              mb: 2,
              opacity: 0.8,
            }}
          />
          <Typography
            variant="h1"
            sx={{ fontWeight: 700, mb: 2, fontSize: "4rem" }}
          >
            404
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Page Not Found
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            The page you're looking for doesn't exist or has been moved
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{
              borderRadius: 2,
              px: 3,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
              },
            }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: "rgba(255,255,255,0.5)",
              color: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFound;
