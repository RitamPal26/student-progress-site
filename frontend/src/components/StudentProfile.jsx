import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Avatar,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  ArrowBack,
  Sync,
  TrendingUp,
  Assessment,
  EmojiEvents,
  Code,
  CalendarToday,
} from "@mui/icons-material";
import { studentAPI, dataAPI, summaryAPI } from "../services/api";
import DarkModeToggle from "./DarkModeToggle";
import NotFound from "./NotFound";

// Enhanced InfoCard with modern design
const InfoCard = ({ student }) => (
  <Card
    elevation={0}
    sx={{
      height: "fit-content",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
      },
    }}
  >
    <CardContent sx={{ position: "relative", zIndex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            mr: 2,
            width: 56,
            height: 56,
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {student.codeforcesHandle[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {student.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Codeforces Profile
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2}>
        <Box>
          <Typography
            variant="caption"
            sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}
          >
            Contact Information
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            📧 {student.email}
          </Typography>
          <Typography variant="body2">📱 {student.phone}</Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

        <Box>
          <Typography
            variant="caption"
            sx={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}
          >
            Codeforces Stats
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, mb: 1 }}>
            🏷️ Handle: <strong>{student.codeforcesHandle}</strong>
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Chip
              label={`Current: ${student.currentRating}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
              size="small"
            />
            <Chip
              label={`Max: ${student.maxRating}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.3)",
                color: "white",
                fontWeight: 600,
              }}
              size="small"
            />
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Last Updated: {new Date(student.lastUpdated).toLocaleDateString()}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Enhanced ContestCard with gradient and better styling
const ContestCard = ({ data, range, onRangeChange }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Contest Performance
          </Typography>
        </Box>
        <ToggleButtonGroup
          exclusive
          value={range}
          onChange={(_, v) => v && onRangeChange(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: 2,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            },
          }}
        >
          <ToggleButton value={30}>30D</ToggleButton>
          <ToggleButton value={90}>90D</ToggleButton>
          <ToggleButton value={365}>365D</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#1976d2"
              strokeWidth={3}
              fill="url(#ratingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// Enhanced StatsCard with better visual hierarchy
const StatsCard = ({ summary, range }) => {
  if (!summary)
    return (
      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        </CardContent>
      </Card>
    );

  const stats = [
    {
      label: "Total Solved",
      value: summary.totalSolved,
      icon: "🎯",
      color: "#4caf50",
    },
    {
      label: "Avg Rating",
      value: Math.round(summary.avgRating),
      icon: "📊",
      color: "#2196f3",
    },
    {
      label: "Hardest Problem",
      value: summary.maxRating,
      icon: "🔥",
      color: "#ff5722",
    },
    {
      label: "Daily Average",
      value: (summary.totalSolved / range).toFixed(2),
      icon: "📅",
      color: "#9c27b0",
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        height: "fit-content",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Assessment color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Problem Statistics
          </Typography>
          <Chip
            label={`${range}D`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Stack spacing={2}>
          {stats.map((stat, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
                    {stat.icon}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Enhanced ProblemsCard with modern bar chart
const ProblemsCard = ({ barData, range, onRangeChange }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Code color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Problems by Difficulty
          </Typography>
        </Box>
        <ToggleButtonGroup
          exclusive
          value={range}
          onChange={(_, v) => v && onRangeChange(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: 2,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            },
          }}
        >
          <ToggleButton value={7}>7D</ToggleButton>
          <ToggleButton value={30}>30D</ToggleButton>
          <ToggleButton value={90}>90D</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="count" fill="#4caf50" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// Enhanced HeatmapCard with better styling
const HeatmapCard = ({ values, range }) => {
  // Fix: Group submissions by date to get proper counts
  const processedValues = useMemo(() => {
    if (!values || values.length === 0) return [];

    const dateMap = {};
    values.forEach((v) => {
      if (dateMap[v.date]) {
        dateMap[v.date].count += 1;
      } else {
        dateMap[v.date] = { date: v.date, count: 1 };
      }
    });

    return Object.values(dateMap);
  }, [values]);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <CalendarToday color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Activity Heatmap
          </Typography>
          <Chip
            label={`${range} days`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            bgcolor: "grey.50",
            borderRadius: 2,
            p: 3,
            "& .react-calendar-heatmap": {
              width: "100%",
            },
            "& .react-calendar-heatmap text": {
              fontSize: "10px",
              fill: "#666",
              fontWeight: 500,
            },
            "& .react-calendar-heatmap .scale-0": {
              fill: "#ebedf0",
            },
            "& .react-calendar-heatmap .scale-1": {
              fill: "#c6e48b",
            },
            "& .react-calendar-heatmap .scale-2": {
              fill: "#7bc96f",
            },
            "& .react-calendar-heatmap .scale-3": {
              fill: "#239a3b",
            },
            "& .react-calendar-heatmap .scale-4": {
              fill: "#196127",
            },
          }}
        >
          <CalendarHeatmap
            startDate={new Date(Date.now() - range * 24 * 60 * 60 * 1000)}
            endDate={new Date()}
            values={processedValues}
            classForValue={(value) => {
              if (!value || value.count === 0) return "scale-0";
              return `scale-${Math.min(value.count, 4)}`;
            }}
            tooltipDataAttrs={(value) => ({
              "data-tip":
                value && value.date
                  ? `${value.date}: ${value.count} submission${
                      value.count !== 1 ? "s" : ""
                    }`
                  : "No submissions",
            })}
            showWeekdayLabels={true}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// MAIN COMPONENT with enhanced header and layout
const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [contests, setContests] = useState([]);
  const [subs, setSubs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestRange, setContestRange] = useState(90);
  const [problemRange, setProblemRange] = useState(30);

  // Fetch functions
  const handleApiError = (error, context) => {
    console.error(`Error in ${context}:`, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 404) {
        setError({ type: "not_found", message: "Student not found" });
      } else if (status === 500) {
        setError({
          type: "server_error",
          message: `Server error: ${message}. This might be due to an invalid Codeforces handle.`,
        });
      } else {
        setError({
          type: "api_error",
          message: `API Error (${status}): ${message}`,
        });
      }
    } else if (error.request) {
      setError({
        type: "network_error",
        message: "Network error. Please check your connection.",
      });
    } else {
      setError({
        type: "unknown_error",
        message: error.message || "An unexpected error occurred",
      });
    }
  };

  const fetchStudent = async () => {
    try {
      const { data } = await studentAPI.getAll();
      const foundStudent = data.find((s) => s._id === id);

      if (!foundStudent) {
        setError({ type: "not_found", message: "Student not found" });
        return;
      }

      setStudent(foundStudent);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching student:", error);
      if (error.response?.status === 404) {
        setError({ type: "not_found", message: "Student not found" });
      } else if (error.response?.status === 500) {
        setError({
          type: "server_error",
          message:
            "Server error. This might be due to an invalid Codeforces handle.",
        });
      } else {
        setError({
          type: "api_error",
          message: error.message || "Failed to load student data",
        });
      }
    }
  };

  const fetchContests = async (range = contestRange) => {
    try {
      const { data } = await dataAPI.getContests(id, range);
      setContests(data);
    } catch (error) {
      console.error("Error fetching contests:", error);
      // Don't set error state for secondary data - just log it
    }
  };

  const fetchSubs = async (range = problemRange) => {
    try {
      const after = new Date(Date.now() - range * 864e5).toISOString();
      const { data } = await dataAPI.getSubmissions(id, after);
      setSubs(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      // Don't set error state for secondary data - just log it
    }
  };

  const fetchSummary = async (range = problemRange) => {
    try {
      const { data } = await summaryAPI.getProblems(id, range);
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      // Don't set error state for secondary data - just log it
    }
  };

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      await fetchStudent();
      setLoading(false);
    };

    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (student && !error) {
      fetchContests(contestRange);
    }
  }, [student, contestRange, error]);

  useEffect(() => {
    if (student && !error) {
      fetchSubs(problemRange);
      fetchSummary(problemRange);
    }
  }, [student, problemRange, error]);

  // Derived data
  const ratingData = useMemo(
    () =>
      contests.map((c) => ({
        date: new Date(c.contestDate).toLocaleDateString(),
        rating: c.newRating,
      })),
    [contests]
  );

  const barData = useMemo(() => {
    const buckets = {};
    subs.forEach((s) => {
      const rating = s.problemRating || 0;
      const key = Math.floor(rating / 200) * 200;
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets)
      .map(([b, c]) => ({ bucket: `${b}-${+b + 199}`, count: c }))
      .sort((a, b) => parseInt(a.bucket) - parseInt(b.bucket));
  }, [subs]);

  const heatVals = useMemo(() => {
    if (!subs || subs.length === 0) return [];

    return subs.map((s) => {
      const date = new Date(s.submissionTime);
      const formattedDate = date.toISOString().slice(0, 10);

      return {
        date: formattedDate,
        count: 1,
      };
    });
  }, [subs]);

  const handleSync = async () => {
    setLoading(true);
    try {
      await studentAPI.sync(id);
      await Promise.all([
        fetchStudent(),
        fetchContests(),
        fetchSubs(),
        fetchSummary(),
      ]);
    } catch (error) {
      console.error("Sync failed:", error);
      setError({
        type: "sync_error",
        message: "Failed to sync data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary">
            Loading student data...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show error states
  if (error) {
    if (error.type === "not_found") {
      return <NotFound />;
    }

    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            "& .MuiAlert-message": { width: "100%" },
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchStudent().finally(() => setLoading(false));
              }}
            >
              Retry
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Error Loading Student Data
          </Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      </Container>
    );
  }

  // Show error if student is still null after loading
  if (!student) {
    return <NotFound />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "white",
                boxShadow: 1,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {student.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Competitive Programming Dashboard
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleSync}
            disabled={loading}
            startIcon={<Sync />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 2,
            }}
          >
            {loading ? "Syncing..." : "Sync Data"}
          </Button>
        </Box>
      </Paper>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        {/* Info Card */}
        <Grid item xs={12} lg={4}>
          <InfoCard student={student} />
        </Grid>

        {/* Contest History */}
        <Grid item xs={12} lg={8}>
          <ContestCard
            data={ratingData}
            range={contestRange}
            onRangeChange={setContestRange}
          />
        </Grid>

        {/* Problem Stats */}
        <Grid item xs={12} lg={4}>
          <StatsCard summary={summary} range={problemRange} />
        </Grid>

        {/* Problem Distribution Chart */}
        <Grid item xs={12} lg={8}>
          <ProblemsCard
            barData={barData}
            range={problemRange}
            onRangeChange={setProblemRange}
          />
        </Grid>

        {/* Heatmap - Full Width */}
        <Grid item xs={12}>
          <HeatmapCard values={heatVals} range={problemRange} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentProfile;
