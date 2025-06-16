import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

type Props = {};

const Header = (props: Props) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = {
    SuperAdmin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Companies", path: "/companies" },
      { label: "Admins", path: "/admins" },
      { label: "History", path: "/history" },
    ],
    Admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Companies", path: "/companies" },
      { label: "History", path: "/history" },
    ],
    User: [
      { label: "Create Company", path: "/companies/create" },
      { label: "My History", path: "/history" },
    ],
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Company Dashboard
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems[role as keyof typeof navItems]?.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            <IconButton onClick={handleMenuOpen}>
              <Avatar src={`${process.env.REACT_APP_API_URL}${user?.avatarUrl}`} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleMenuClose();
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  logout();
                  handleMenuClose();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
