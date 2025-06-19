import { CircularProgress, Container, Typography } from '@mui/material';
import { useActionHistory } from '../../api/actionHistory';
import { HistoryTable } from '../../components/history/HistoryTable';

export const AdminHistoryPage = () => {
  const { data, isLoading, error } = useActionHistory(true);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        All User Actions (Admin View)
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Failed to load history</Typography>}
      {data && <HistoryTable data={data.data} />}
    </Container>
  );
};
