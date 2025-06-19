import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  Chip,
} from "@mui/material";

type ActionHistoryItem = {
  id: number;
  user: {
    id: number;
    email: string;
  };
  actionType: string;
  targetType: string;
  targetId: number;
  actionDetails: Record<string, any> | null;
  timestamp: string | number | Date;
};

export const HistoryTable = ({ data }: { data: ActionHistoryItem[] }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <Typography>No history available.</Typography>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        my: 3,
        height: "80vh",
        overflowY: "auto",
      }}
    >
      <Table stickyHeader aria-label="history table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action Type</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((action) => (
            <TableRow key={action.id}>
              <TableCell>{action.id}</TableCell>
              <TableCell>{action.user?.email ?? "N/A"}</TableCell>
              <TableCell>
                <Chip label={action.actionType} color="primary" size="small" />
              </TableCell>
              <TableCell>
                {action.targetType} #{action.targetId}
              </TableCell>
              <TableCell>
                {action.actionDetails
                  ? JSON.stringify(action.actionDetails)
                  : "—"}
              </TableCell>
              <TableCell>
                {new Date(action.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
