"use client";
import { CookiesProvider } from "react-cookie";

export default function CookiesProviderLayout({ children }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
