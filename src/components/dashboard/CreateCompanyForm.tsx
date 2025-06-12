import { Box, Button, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCompany } from "../../api/companies";
import { useState } from "react";

type Props = {};

const CreateCompanyForm = (props: Props) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    service: "",
    capital: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("Company created!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setForm({
        name: "",
        service: "",
        capital: "",
      });
    },
    onError: () => {
      toast.error("Failed to create company");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    mutate({
    ...form,
    capital: form.capital ? parseFloat(form.capital) : undefined,
  });
  };

  return (
    <>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Create a New Company
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
          required
        />
        <TextField
          label="Capital"
          name="capital"
          value={form.capital}
          onChange={handleChange}
          required
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create Company'}
        </Button>
      </Box>
    </>
  );
};

export default CreateCompanyForm;
