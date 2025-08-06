// src/utils/api-helpers.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});

const get = (url: string, config?: any) => api.get(url, config).then(res => res.data);
const post = (url: string, data: any, config?: any) => api.post(url, data, config).then(res => res.data);
const patch = (url: string, data: any, config?: any) => api.patch(url, data, config).then(res => res.data);
const del = (url: string, config?: any) => api.delete(url, config).then(res => res.data);

export { get, post, patch, del };