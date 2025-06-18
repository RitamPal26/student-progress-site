import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Fade,
  Alert,
  Snackbar,
  Container,
  Paper,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Search,
  Refresh,
  Person,
  TrendingUp,
  Code,
  Warning,
} from "@mui/icons-material";
import { CSVLink } from "react-csv";
import { studentAPI } from "../services/api";
import StudentDialog from "./StudentDialog";

const StudentTable = ({ onViewStudent }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    student: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.codeforcesHandle
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
      showNotification("Students loaded successfully", "success");
    } catch (error) {
      console.error("Error fetching students:", error);
      showNotification("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (studentData) => {
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent._id, studentData);
        showNotification("Student updated successfully", "success");
      } else {
        await studentAPI.create(studentData);
        showNotification("Student added successfully", "success");
      }
      fetchStudents();
      setEditingStudent(null);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving student:", error);
      showNotification("Failed to save student", "error");
    }
  };

  const getActivityStatus = (lastUpdated) => {
    const daysSince =
      (Date.now() - new Date(lastUpdated)) / (1000 * 60 * 60 * 24);
    if (daysSince <= 1) return { color: "success", text: "Active", icon: "🟢" };
    if (daysSince <= 7) return { color: "warning", text: "Recent", icon: "🟡" };
    return { color: "error", text: "Inactive", icon: "🔴" };
  };

  const getRatingColor = (rating) => {
    if (rating >= 2100) return "#ff8a00"; // Orange
    if (rating >= 1900) return "#a0a"; // Violet
    if (rating >= 1600) return "#0000ff"; // Blue
    if (rating >= 1400) return "#008000"; // Green
    if (rating >= 1200) return "#00ffff"; // Cyan
    return "#808080"; // Gray
  };

  const handleDelete = async () => {
    try {
      await studentAPI.delete(deleteDialog.student._id);
      fetchStudents();
      setDeleteDialog({ open: false, student: null });
      showNotification("Student deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showNotification("Failed to delete student", "error");
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const csvData = students.map((student) => ({
    Name: student.name,
    Email: student.email,
    Phone: student.phone,
    "CF Handle": student.codeforcesHandle,
    "Current Rating": student.currentRating,
    "Max Rating": student.maxRating,
    Status: getActivityStatus(student.lastUpdated).text,
    "Last Updated": new Date(student.lastUpdated).toLocaleDateString(),
  }));

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 32,
            height: 32,
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          {params.row.name[0].toUpperCase()}
        </Avatar>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "codeforcesHandle",
      headerName: "Codeforces",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          icon={<Code />}
          sx={{
            bgcolor: "primary.50",
            color: "primary.main",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "currentRating",
      headerName: "Current",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value || "Unrated"}
          size="small"
          sx={{
            bgcolor: getRatingColor(params.value),
            color: "white",
            fontWeight: 600,
            minWidth: 70,
          }}
        />
      ),
    },
    {
      field: "maxRating",
      headerName: "Peak",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
          <Typography variant="body2" fontWeight={600} color="success.main">
            {params.value || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = getActivityStatus(params.row.lastUpdated);
        return (
          <Chip
            label={status.text}
            color={status.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "lastUpdated",
      headerName: "Last Sync",
      width: 120,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              onClick={() => onViewStudent(params.row._id)}
              sx={{
                bgcolor: "primary.50",
                color: "primary.main",
                "&:hover": { bgcolor: "primary.100" },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student">
            <IconButton
              size="small"
              onClick={() => {
                setEditingStudent(params.row);
                setDialogOpen(true);
              }}
              sx={{
                bgcolor: "warning.50",
                color: "warning.main",
                "&:hover": { bgcolor: "warning.100" },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Student">
            <IconButton
              size="small"
              onClick={() =>
                setDeleteDialog({ open: true, student: params.row })
              }
              sx={{
                bgcolor: "error.50",
                color: "error.main",
                "&:hover": { bgcolor: "error.100" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
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
            <Person sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Student Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Track competitive programming progress
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${students.length} Students`}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              px: 1,
            }}
          />
        </Box>
      </Paper>

      {/* Controls Section */}
      <Card
        elevation={0}
        sx={{ mb: 3, border: "1px solid", borderColor: "divider" }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
              size="small"
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingStudent(null);
                  setDialogOpen(true);
                }}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              >
                Add Student
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchStudents}
                disabled={loading}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Refresh
              </Button>

              <CSVLink
                data={csvData}
                filename={`students_${
                  new Date().toISOString().split("T")[0]
                }.csv`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Export CSV
                </Button>
              </CSVLink>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredStudents}
            columns={columns}
            getRowId={(row) => row._id}
            loading={loading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "grey.50",
                borderBottom: "2px solid",
                borderColor: "divider",
                "& .MuiDataGrid-columnHeader": {
                  fontWeight: 700,
                },
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  bgcolor: "action.hover",
                },
                "&.Mui-selected": {
                  bgcolor: "primary.50",
                  "&:hover": {
                    bgcolor: "primary.100",
                  },
                },
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 1,
              },
            }}
          />
        </Box>
      </Card>

      {/* Student Dialog */}
      <StudentDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSave}
        student={editingStudent}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, student: null })}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.student?.name}</strong>? All associated data
            will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, student: null })}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Delete Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentTable;
