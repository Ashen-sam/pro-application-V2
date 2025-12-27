// User entity
export interface User {
  user_id: number;
  name: string;
  email: string;
  created_at: string;
  profile_picture?: string;
  full_name?: string;
}

// Auth related types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// User CRUD types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

// API Response types
export interface UserResponse {
  success: boolean;
  user: User;
}

export interface UsersListResponse {
  success: boolean;
  users: User[];
}

export interface SearchUsersResponse {
  success: boolean;
  users: User[];
}

export interface DeleteUserResponse {
  success: boolean;
}

// Error response type
export interface ErrorResponse {
  success: false;
  message?: string;
  error?: unknown;
}
