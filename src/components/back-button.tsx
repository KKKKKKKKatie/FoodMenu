"use client";

import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const pathname = usePathname();
  const router = useRouter();

  if (!isClient) {
    return null;
  }

  if (pathname === "/" || pathname === "/admin") {
    return null;
  }

  function handleBack() {
    if (pathname === "/admin/login") {
      router.push("/");
      return;
    }

    if (pathname.startsWith("/admin")) {
      router.push("/admin");
      return;
    }

    router.push("/");
  }

  return (
    <button type="button" className="button button--ghost back-button" onClick={handleBack} aria-label="Go back">
      <span className="back-button__icon" aria-hidden="true">
        ←
      </span>
    </button>
  );
}
