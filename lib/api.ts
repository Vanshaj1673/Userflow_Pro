// lib/api.ts
import axios from 'axios';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  BulkUploadResult,
} from '@/types/user';

const BASE_URL = 'http://localhost:5000/api/users';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${BASE_URL}`);
  return res.data.users;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createUser = async (data: CreateUserRequest) => {
  const res = await axios.post(`${BASE_URL}`, data);
  return res.data;
};

export const updateUser = async (id: string, data: UpdateUserRequest) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

// Placeholder for bulk upload - will be implemented when backend is ready
export const bulkUploadUsers = async (file: File): Promise<BulkUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${BASE_URL}/bulk-upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};
