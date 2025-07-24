export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  detail?: string;
  reason?: string;
}
