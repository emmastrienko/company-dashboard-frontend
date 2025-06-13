import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCompany } from "../../../api/companies";
import { useState } from "react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

L.Icon.Default.mergeOptions({
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
    click(e: L.LeafletMouseEvent) {
      onSelect({ x: e.latlng.lng, y: e.latlng.lat });
    },
  });
  return null;
};

const CreateCompanyForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    service: "",
    capital: "",
    location: { x: 0, y: 0 },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      toast.success("Company created!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setForm({
        name: "",
        service: "",
        capital: "",
        location: { x: 0, y: 0 },
      });
      navigate(`/companies/${data.id}/add-logo`)
    },
    onError: () => {
      toast.error("Failed to create company");
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
      location: `(${form.location.x}, ${form.location.y})`
    });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Create a New Company
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
          type="number"
          value={form.capital}
          onChange={handleChange}
          required
          fullWidth
        />

        <Typography variant="subtitle1">Pick Company Location:</Typography>

        <Box height="300px" borderRadius={2} overflow="hidden">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={3}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker onSelect={handleLocationSelect} />
            <Marker
              position={[form.location.y, form.location.x]}
              draggable={false}
            />
          </MapContainer>
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
          {isPending ? "Creating..." : "Create Company"}
        </Button>
      </Box>
      <br />
      <br />
    </Container>
  );
};

export default CreateCompanyForm;
