import { User } from "@/types/auth";

export function saveAuth(
  token: string,
  user: User
) {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
}