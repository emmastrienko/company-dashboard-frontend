import { useQuery } from "@tanstack/react-query";
import { fetchUserCompanies } from "../../api/companies";
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
import Grid from "@mui/system/Grid";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageNotSupportedTwoTone } from "@mui/icons-material";

type Props = {};

type Company = {
  id: number;
  name: string;
  service?: string;
  capital?: number;
  logoUrl?: string;
};

interface PaginatedCompanies {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

const UserDashboard = (props: Props) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const limit = 12;

  const { data, isLoading, error } = useQuery<PaginatedCompanies, Error>({
    queryKey: ["myCompanies", page],
    queryFn: () => fetchUserCompanies(page, limit),
  });

  if (isLoading)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Something went wrong</Alert>
      </Container>
    );
  }

  const companies = data?.data || [];
  const hasCompanies = companies && companies.length > 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {hasCompanies ? "My Companies" : "You Have No Companies Yet"}
      </Typography>

      {hasCompanies ? (
        <>
          <Grid container spacing={2}>
            {companies.map((company: Company) => (
              <Grid size={{ xs: 12, md: 4 }} key={company.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        mb: 2,
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        px: 1,
                      }}
                    >
                      {company.logoUrl ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${company.logoUrl}`}
                          alt={`${company.name} logo`}
                          style={{
                            height: "100%",
                            objectFit: "contain",
                          }}
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
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/companies/edit/${company.id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {}}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

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
              disabled={page === 1}
              onClick={() => setPage((old: number) => Math.max(old - 1, 1))}
            >
              Previous
            </Button>
            <Typography variant="body1" sx={{ alignSelf: "center" }}>
              Page {page} of {data?.pageCount || 1}
            </Typography>
            <Button
              variant="outlined"
              disabled={page === (data?.pageCount || 1)}
              onClick={() =>
                setPage((old: number) =>
                  data?.pageCount ? Math.min(old + 1, data.pageCount) : old + 1
                )
              }
            >
              Next
            </Button>
          </Box>

          <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
            Capital Chart
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companies}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="capital" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Box
          sx={{
            minHeight: "80dvh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary" mb={2}>
            Start by creating your first company.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/companies/create")}
            sx={{ mb: 2 }}
          >
            Create Company
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserDashboard;
