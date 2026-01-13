export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
}

export interface DetailItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  details?: Record<string, any>;
}
