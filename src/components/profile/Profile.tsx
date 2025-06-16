import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import { uploadAvatar } from "../../api/user";
import { toast } from "react-toastify";
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { useRef, useState } from "react";

type User = {
  id: number;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

const fetchUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

const Profile = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: fetchUser,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.refetchQueries({ queryKey: ["me"] });
      toast.success("Avatar updated");
    } catch (error) {
      toast.error("Failed to update avatar");
    }
  };

  if (isLoading)
    return <Skeleton variant="rectangular" width="100%" height={100} />;

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <Box>
      <Stack direction="row" spacing={3} alignItems="center" mb={3}>
        <Box
          position="relative"
          width={64}
          height={64}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => fileInputRef.current?.click()}
          sx={{ cursor: "pointer" }}
        >
          <Avatar
            src={`${process.env.REACT_APP_API_URL}${user?.avatarUrl}`}
            sx={{ width: 64, height: 64 }}
          />
          {isHovering && (
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                boxShadow: 1,
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          )}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleUpload}
          />
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold">
            Email:
          </Typography>
          <Typography variant="body2" mb={1}>
            {user?.email}
          </Typography>

          <Typography variant="body1" fontWeight="bold">
            Role:
          </Typography>
          <Typography variant="body2">{user?.role}</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Profile;
