import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading} = useAuth();

  if(isLoading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', mt: 4 }} >
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="login" replace />
}