import api from "./api";

export const fetchAdminStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const fetchAdmins = async () => {
  const { data } = await api.get("/dashboard/admins");
  return data;
};


export const addAdmin = async (email: string) => {
  const { data } = await api.post("/dashboard/admins", { email });
  return data;
};

export const deleteAdmin = async (id: number) => {
  const { data } = await api.delete(`/dashboard/admins/${id}`);
  return data;
};
