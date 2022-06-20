export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T[];
  info?: Info;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  uid?: string;
  token?: string;
}

export interface Info {
  page: number;
}
