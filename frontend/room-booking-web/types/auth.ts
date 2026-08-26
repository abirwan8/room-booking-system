export type User = {
  id: number;
  name: string;
  email: string;
  role: "User" | "Admin";
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: User;
};