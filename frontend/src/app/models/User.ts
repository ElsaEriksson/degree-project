export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

export interface ModestUser {
  user_id: number;
  first_name: string;
  email: string;
}
