export interface User {
    id: Number;
    email: string;
    username: string;
    role: string;
  }
  
  export interface AuthResponse {
    token: string;
  }
