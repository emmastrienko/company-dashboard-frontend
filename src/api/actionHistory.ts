import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

const getHistory = async (isAdmin: boolean) => {
  const endpoint = isAdmin ? '/history/all' : '/history/user';
  const response = await api.get(endpoint);
  return {data: response.data};
};

export const useActionHistory = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['actionHistory', isAdmin],
    queryFn: () => getHistory(isAdmin),
  });
};
