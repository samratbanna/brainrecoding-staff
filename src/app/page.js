"use client";

import { Box } from "@chakra-ui/react";
import { Dashboard } from "../component/Dashboard";
import { MainLayout } from "../layouts/MainLayouts";
import { useLoginStore } from "@/store/login";
import { useMemo } from "react";
import { Lead } from "../component/lead";

export default function Page() {
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));
  const isFindTeleCaller = useMemo(() => userData?.role == "CALLER", [userData]);
  return (
    <Box bg="white" w="full" minH="100vh">
        <MainLayout>{!isFindTeleCaller ? <Dashboard /> : <Lead />}</MainLayout>
    </Box>
  );
}
