import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Link,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const loginUser = async (
  data: LoginFormData
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

const LoginForm = (props: Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      if (error.response) {
        if (error.response.status === 401) {
          setError("email", { message: "" });
          setError("password", {
            message: error.response.data.message || "Invalid credentials",
          });
        } else {
          toast.error(error.response.data.message || "Login failed");
        }
      } else if (error.request) {
        toast.error("Network error - please try again");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    mutation.mutate(data);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Typography variant="body2">Don't have an account?</Typography>
            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Create one
            </Link>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
