import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyById, uploadCompanyLogo } from "../../../api/companies";
import { toast } from "react-toastify";

const AddLogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logo, setLogo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      if (!id) return;
      try {
        const company = await getCompanyById(parseInt(id));
        if (company.logoUrl) {
          setExistingLogoUrl(`${process.env.REACT_APP_API_URL}${company.logoUrl}`);
        }
      } catch (error) {
        toast.error("Failed to fetch company data");
      }
    };
    fetchLogo();
  }, [id]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!logo || !id) return;

    setIsUploading(true);
    try {
      await uploadCompanyLogo(parseInt(id), logo);
      toast.success("Logo uploaded successfully!");
      navigate("/companies");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate("/companies");
  };

  return (
    <Box
      minHeight="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            {existingLogoUrl
              ? "Update Company Logo"
              : "Add Company Logo (Optional)"}
          </Typography>

          {existingLogoUrl && (
            <Box mt={2} textAlign="center">
              <Typography variant="subtitle1">Current Logo:</Typography>
              <Box
                component="img"
                src={existingLogoUrl}
                alt="Company Logo"
                sx={{ maxHeight: 200, maxWidth: "100%", mt: 1 }}
              />
            </Box>
          )}

          <Paper
            variant="outlined"
            sx={{
              border: dragActive ? "2px dashed #1976d2" : "2px dashed #ccc",
              padding: 4,
              textAlign: "center",
              backgroundColor: dragActive ? "#f0f8ff" : "transparent",
              cursor: "pointer",
              mt: 2,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("logoInput")?.click()}
          >
            <Typography>
              {logo
                ? `Selected file: ${logo.name}`
                : `Drag & drop logo here, or click to browse`}
            </Typography>
            <input
              id="logoInput"
              type="file"
              onChange={handleLogoChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Paper>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!logo || isUploading}
            >
              {isUploading ? <CircularProgress size={24} /> : "Upload Logo"}
            </Button>
            <Button variant="outlined" onClick={handleSkip}>
              Skip
            </Button>
          </Box>
        </Box>
      </Container>
      <br />
      <br />
      <br />
    </Box>
  );
};

export default AddLogo;
