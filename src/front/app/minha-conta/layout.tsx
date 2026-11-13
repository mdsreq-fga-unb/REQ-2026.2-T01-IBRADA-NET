import type { ReactNode } from "react";
import { RequireAuth } from "@/components/require-auth";

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
    return <RequireAuth>{children}</RequireAuth>;
}
