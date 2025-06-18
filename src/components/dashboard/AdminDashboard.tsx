import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "../../api/dashboard";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load stats</Alert>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ bgcolor: "#f0f0f0", flex: "1 1 260px" }}>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{data.totalUsers}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "#f0f0f0", flex: "1 1 260px" }}>
          <CardContent>
            <Typography variant="h6">Total Companies</Typography>
            <Typography variant="h4">{data.totalCompanies}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
