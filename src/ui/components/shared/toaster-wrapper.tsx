"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function ToasterWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Toaster position="bottom-right" />;
}
