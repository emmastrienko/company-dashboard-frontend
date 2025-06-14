import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as leaflet from "leaflet";
import { Marker } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyById, updateCompany } from "../../../api/companies";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationPicker = ({
  onSelect,
}: {
  onSelect: (coords: { x: number; y: number }) => void;
}) => {
  useMapEvents({
    click(e: leaflet.LeafletMouseEvent) {
      onSelect({ x: e.latlng.lng, y: e.latlng.lat });
    },
  });
  return null;
};

const EditCompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = Number(id);

  const [form, setForm] = useState({
    name: "",
    service: "",
    capital: "",
    location: { x: 0, y: 0 },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        service: data.service || "",
        capital: data.capital?.toString() || "",
        location: {
          x: data.location?.x || 0,
          y: data.location?.y || 0,
        },
      });
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (updatedData: any) => updateCompany(companyId, updatedData),
    onSuccess: () => {
      toast.success("Company updated!");
      queryClient.invalidateQueries({ queryKey: ["myCompanies"] });
      navigate(`/companies/${data.id}/add-logo`)
    },
    onError: () => {
      toast.error("Failed to update company");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (coords: { x: number; y: number }) => {
    setForm((prev) => ({
      ...prev,
      location: coords,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    mutate({
      name: form.name,
      service: form.service,
      capital: form.capital ? parseFloat(form.capital) : undefined,
      location: `(${form.location.x}, ${form.location.y})`,
    });
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Edit Company
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Capital"
          name="capital"
          value={form.capital}
          onChange={handleChange}
          required
          fullWidth
        />

        <Typography variant="subtitle1">Update Company Location:</Typography>
        <Box height="300px" borderRadius={2} overflow="hidden">
          {form.location.x !== 0 && form.location.y !== 0 && (
            <MapContainer
              center={[form.location.y, form.location.x]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker onSelect={handleLocationSelect} />
              <Marker position={[form.location.y, form.location.x]} />
            </MapContainer>
          )}
        </Box>
        <TextField
          label="Longitude (x)"
          value={form.location.x}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Latitude (y)"
          value={form.location.y}
          InputProps={{ readOnly: true }}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Updating..." : "Update Company"}
        </Button>
      </Box>
      <br />
      <br />
    </Container>
  );
};

export default EditCompanyForm;
