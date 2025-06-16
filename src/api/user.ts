import api from "./api";

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return api.post("/users/me/change-password", data);
};
