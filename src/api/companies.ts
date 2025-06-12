import api from "./api"

export const fetchUserCompanies = async (page = 1, limit = 10) => {
  const res = await api.get(`/companies/my?page=${page}&limit=${limit}`);
  return res.data;
}

export const createCompany = async (companyData: {
  name: string;
  service?: string;
  capital?: number;
}) => {
  const res = await api.post('/companies', companyData);
  return res.data;
}