import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ImageNotSupportedTwoTone } from "@mui/icons-material";
import { fetchAllCompanies } from "../../../api/companies";

type Company = {
  id: number;
  name: string;
  service?: string;
  capital?: number;
  logoUrl?: string;
  owner: {
    email: string;
    avatarUrl?: string;
  };
};

const AllCompanies = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const { data, isLoading, error } = useQuery({
    queryKey: ["allCompanies", page, limit, sortBy, order],
    queryFn: () => fetchAllCompanies({ page, limit, sortBy, order }),
  });

  const handleSortChange = (e: SelectChangeEvent) => {
    setSortBy(e.target.value);
  };

  const toggleOrder = () => {
    setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  const companies: Company[] = Array.isArray(data?.data) ? data.data : [];
  const pageCount =
    data?.pageCount ?? (Math.ceil((data?.total ?? 0) / limit) || 1);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Companies
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <FormControl>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
            size="small"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="capital">Capital</MenuItem>
            <MenuItem value="created_at">Created At</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={toggleOrder}>
          Order: {order}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load companies</Alert>
      ) : companies.length === 0 ? (
        <Typography>No companies found.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {companies.map((company) => (
            <Card key={company.id} sx={{ width: 300 }}>
              <CardContent>
                <Box
                  sx={{
                    mb: 2,
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    px: 1,
                    gap: 1,
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

                <Typography variant="h6">{company.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Service: {company.service || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capital: ${company.capital || 0}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption">
                    Owner: {company.owner.email}
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    View
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 3,
          mb: 6,
        }}
      >
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ alignSelf: "center" }}>
          Page {page} of {pageCount}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= pageCount}
          onClick={() => setPage((old) => Math.min(old + 1, pageCount))}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default AllCompanies;
