export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  houseName?: string;
  street?: string;
  district?: string;
  state?: string;
  zipcode?: string;
}

export interface AuthResponse {
  token: string;
}
