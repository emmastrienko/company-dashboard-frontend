import { GitHub } from "@mui/icons-material";
import { Box, Container, IconButton, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 3,
        mt: "auto",
        backgroundColor: "#1565c0",
        textAlign: "center",
        color: "white",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="body2"
          sx={{ fontWeight: "500", mb: 1, color: "rgba(255,255,255,0.8)" }}
        >
          {"\u00A9"} {new Date().getFullYear()} Created by{" "}
          <Link
            href="https://github.com/emmastrienko"
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ color: "inherit", fontWeight: "600" }}
          >
            Emma Strienko
          </Link>
        </Typography>
        <IconButton
          href="https://github.com/emmastrienko"
          target="_blank"
          rel="noopener"
          color="inherit"
          aria-label="GitHub"
          sx={{
            bgcolor: "rgba(255,255,255,0.15)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            transition: "background-color 0.3s ease",
            mb: 1,
          }}
        >
          <GitHub fontSize="large" />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255, 255, 255, 0.95)",
            fontStyle: "italic",
          }}
        >
          Crafted with care, ☕, and code
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
