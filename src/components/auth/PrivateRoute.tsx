import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

type PrivateRouteProps = {
  roles?: string[];
};

export const PrivateRoute = ({ roles }: PrivateRouteProps) => {
  const { isAuthenticated, status, role } = useAuth();

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
