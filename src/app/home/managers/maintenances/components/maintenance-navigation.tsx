"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MaintenanceNavigation = ({ property }: { property: String }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/home/managers/maintenances/${property}`);
  }, [property, router]);

  return null;
};

export default MaintenanceNavigation;
