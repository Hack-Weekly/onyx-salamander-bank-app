import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function headerCookieToJSON(cookie: string) {
  const cookies = cookie.split(";");

  const json = {} as Partial<{
    [key: string]: string;
  }>;
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    json[key] = value;
  });

  return json;
}

export function compareDate(date1: Date, date2: Date): boolean {
  const date1String =
    date1.getDate() + "/" + date1.getMonth() + "/" + date1.getFullYear();
  const date2String =
    date2.getDate() + "/" + date2.getMonth() + "/" + date2.getFullYear();
  console.log(date1String);
  console.log(date2String);
  return date1String == date2String;
}
