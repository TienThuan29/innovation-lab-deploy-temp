"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const hideFooter =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/superdirector");

  if (hideFooter) {
    return null;
  }

  return <Footer />;
}
