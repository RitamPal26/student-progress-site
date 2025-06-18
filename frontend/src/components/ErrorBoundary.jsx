import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { ErrorOutline, Home, Refresh, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
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
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ErrorOutline
            sx={{
              fontSize: 80,
              color: "error.main",
              mb: 2,
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an unexpected error while loading this page
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 4, textAlign: "left" }}>
          <Typography variant="body2">
            <strong>Error Details:</strong>{" "}
            {error?.message || "Unknown error occurred"}
          </Typography>
        </Alert>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={handleGoHome}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Refresh Page
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ErrorBoundary;
