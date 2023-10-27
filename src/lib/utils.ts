import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function headerCookieToJSON(cookie: string) {
  const cookies = cookie.split(";");

  let json = {} as Partial<{
    [key: string]: string;
  }>;
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    json[key] = value;
  });

  return json;
}
