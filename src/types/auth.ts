export type UserRole = 'admin' | 'member';

export interface UserRegistration {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
}