import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getApiUrl = (url: string) => {
  return `${import.meta.env.VITE_STRAPI_API_END_POINT}${url}`
}
