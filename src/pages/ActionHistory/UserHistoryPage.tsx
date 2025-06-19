import { CircularProgress, Container, Typography } from "@mui/material";
import { useActionHistory } from "../../api/actionHistory";
import { HistoryTable } from "../../components/history/HistoryTable";

export const UserHistoryPage = () => {
  const { data, isLoading, error } = useActionHistory(false);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Action History
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Failed to load history</Typography>}
      {data && <HistoryTable data={data.data} />}
    </Container>
  );
};
