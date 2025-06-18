import AdminDashboard from "../../components/dashboard/AdminDashboard";
import UserDashboard from "../../components/dashboard/UserDashboard";
import { CircularProgress, Container } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { user, status } = useAuth();

  if (status === "loading") {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user?.role === "Admin" || user?.role === "SuperAdmin") {
    return (
      <>
        <AdminDashboard />
        <UserDashboard />
      </>
    );
  }

  return <UserDashboard />;
};

export default DashboardPage;
