import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, IconButton, Box } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import StudentTable from "./components/StudentTable";
import StudentProfile from "./components/StudentProfile";
import { useNavigate } from "react-router-dom";
import NotFound from "./components/NotFound";
import { CustomThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";

function Dashboard() {
  const navigate = useNavigate();

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  return <StudentTable onViewStudent={handleViewStudent} />;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <CustomThemeProvider>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
}

export default App;
