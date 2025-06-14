import api from "./api";

export const fetchUserCompanies = async (page = 1, limit = 10) => {
  const res = await api.get(`/companies/my?page=${page}&limit=${limit}`);
  return res.data;
};

export const createCompany = async (companyData: {
  name: string;
  service?: string;
  capital?: number;
  location?: any;
}) => {
  const res = await api.post("/companies", companyData);
  return res.data;
};

export const uploadCompanyLogo = async (id: number, logoFile: File) => {
  const formData = new FormData();
  formData.append("logo", logoFile);

  const res = await api.post(`/companies/${id}/logo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteCompany = async (id: number) => {
  const res = await api.delete(`/companies/${id}`);
  return res.data;
}

export const updateCompany = async (
  id: number,
  companyData: {
    name?: string;
    service?: string;
    capital?: number;
    location?: any;
  }
) => {
  const res = await api.patch(`/companies/${id}`, companyData);
  return res.data;
}

export const getCompanyById = async (id: number) => {
  const res = await api.get(`/companies/${id}`);
  return res.data;
}
