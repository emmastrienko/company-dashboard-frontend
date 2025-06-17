import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyById } from "../../../api/companies";
import { MapContainer, TileLayer } from "react-leaflet";
import * as leaflet from "leaflet";
import { Marker } from "react-leaflet";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { ImageNotSupportedTwoTone } from "@mui/icons-material";

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Company = {
  id: number;
  name: string;
  service?: string;
  capital?: number;
  logoUrl?: string;
  location?: {
    x: number;
    y: number;
  };
};

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<Company, Error>({
    queryKey: ["companyDetail", id],
    queryFn: () => getCompanyById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load company details</Alert>
      </Container>
    );
  }

  const company = data;

  return (
    <Container sx={{ my: 4 }} maxWidth="md">
      <Card>
        <CardContent>
          <Box
            sx={{
              mb: 2,
              height: "120px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {company.logoUrl ? (
              <img
                src={`${process.env.REACT_APP_API_URL}${company.logoUrl}`}
                alt={`${company.name} logo`}
                style={{ height: "100%", objectFit: "contain" }}
              />
            ) : (
              <ImageNotSupportedTwoTone fontSize="large" />
            )}
          </Box>

          <Typography variant="h5" gutterBottom>
            {company.name}
          </Typography>
          <Typography variant="body1">
            <strong>Service:</strong> {company.service || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Capital:</strong> ${company.capital || 0}
          </Typography>

          {company.location && (
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                Company Location:
              </Typography>
              <Box height="300px" borderRadius={2} overflow="hidden">
                <MapContainer
                  center={[company.location.y, company.location.x]}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[company.location.y, company.location.x]} />
                </MapContainer>
              </Box>
            </Box>
          )}

          <Box mt={4}>
            <Button variant="contained" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CompanyDetail;
