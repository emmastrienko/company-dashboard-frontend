import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdmins, addAdmin, deleteAdmin } from "../../api/dashboard";
import { useState } from "react";
import { toast } from "react-toastify";

const AdminListPage = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");



  // Fetch admins - ensure the returned data is an array or default to []
  const {
    data: admins,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const data = await fetchAdmins();
      return Array.isArray(data) ? data : [];
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      toast.success("Admin added successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setEmail("");
    },
    onError: () => toast.error("Failed to add admin"),
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      toast.success("Admin deleted");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: () => toast.error("Failed to delete admin"),
  });

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Management
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) {
            addAdminMutation.mutate(email.trim());
          }
        }}
        sx={{ display: "flex", gap: 2, mb: 4 }}
      >
        <TextField
          label="Admin Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">Failed to load admins.</Typography>
      ) : (
        <Paper elevation={2}>
          <List>
            {(admins || []).map((admin: { id: number; email: string }) => (
              <ListItem
                key={admin.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteAdminMutation.mutate(admin.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={admin.email} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AdminListPage;
