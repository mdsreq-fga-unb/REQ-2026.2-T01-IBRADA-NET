"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PublicSiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return pathname === "/gestor/voluntariado" ? null : children;
}
