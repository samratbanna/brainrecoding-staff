import React, { useState, useMemo, useRef } from "react";
import {
  Box,
  Grid,
  useColorModeValue,
  Center,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import dayjs from "dayjs";
// Standard icon imports
import {
  BsPersonFill,
  BsPersonPlusFill,
  BsHandIndexFill,
  BsTelephoneFill,
  BsClipboardCheckFill,
  BsBellFill,
  BsCalendarCheckFill,
  BsTvFill,
  BsCheckCircleFill,
  BsClockFill,
  BsStarFill,
} from "react-icons/bs";

// Import modular dashboard sub-components
import { ProfileHeader } from "./person-dashboard/ProfileHeader";
import { KpiScrollRow } from "./person-dashboard/KpiScrollRow";
import { PerformanceMixCard } from "./person-dashboard/PerformanceMixCard";
import { DailyActivityChart } from "./person-dashboard/DailyActivityChart";
import { StrengthsRisksCard } from "./person-dashboard/StrengthsRisksCard";
import { LeadStatusTable } from "./person-dashboard/LeadStatusTable";
import { WorkDisciplineCard } from "./person-dashboard/WorkDisciplineCard";
import { RecentLeadTimelineCard } from "./person-dashboard/RecentLeadTimelineCard";

// Import services and custom hooks
import { useLoginStore } from "@/store/login";
import { useGetBottomHeirarchy, useGetRoles } from "@/services/staff.service";
import {
  useGetEmployeePerformance,
  useGetEmployeePerformanceMix,
  useGetEmployeeActivityTimeline,
  useGetEmployeeLeadStatusSnapshot,
  useGetEmployeeScorecard,
  useGetEmployeeRecentLeadTimeline,
} from "@/services/dashboard.service";

// Role mapping helper
const getApiRole = (roleItem: any): string => {
  console.log("roleItem", roleItem);
  const roleName = typeof roleItem === "object" ? roleItem?.name : roleItem;
  if (roleName === "TRAINER") return "trainer";
  if (roleName === "TEAM_LEADER") return "teamLeader";
  if (roleName === "GROWTH_PARTNER") return "growthPartner";
  return "trainer"; // fallback default
};

export const PersonXRayDashboard: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { userData } = useLoginStore((s: any) => ({ userData: s.userData }));

  // Fetch direct + indirect reports for the logged-in staff
  const { data: hierarchyData } = useGetBottomHeirarchy(
    { staffId: userData?._id },
    !!userData?._id,
  );
  const { data: rolesData } = useGetRoles();
  
  const hierarchyList: any[] = hierarchyData || [];
  const hasSubordinates = hierarchyList.length > 0;

  // Selected staff from dropdown; null = viewing own dashboard
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const activeStaff = useMemo(() => selectedStaff || userData, [selectedStaff, userData]);
  const userId = useMemo(() => activeStaff?._id || "", [activeStaff]);
  const role = useMemo(() => {
    if (typeof activeStaff?.role === "string") {
      const findRole = rolesData?.find((r: any) => r._id === activeStaff.role);
      return getApiRole(findRole || activeStaff?.role);
    }
    return getApiRole(activeStaff?.role);
  }, [activeStaff, rolesData]);

  // Theme colors passed down to child components
  const bg = useColorModeValue("#F8F9FB", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.850", "white");
  const textSecondary = useColorModeValue("gray.500", "gray.400");

  // Default date ranges: last 7 days (today - 7d to today)
  const defaultStartDate = useMemo(
    () => dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    [],
  );
  const defaultEndDate = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  // Live date filter state
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Controls print-mode layout (KPI cards wrap into grid instead of scroll)
  const [isPrinting, setIsPrinting] = useState(false);

  // Export dashboard as PDF
  const handleExportReport = async () => {
    if (!dashboardRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const name = activeStaff?.name || "person";

    // Switch KPI row to wrapping grid and wait for React to paint
    setIsPrinting(true);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    const element = dashboardRef.current!;

    try {
      await html2pdf()
        .set({
          margin: 6,
          filename: `${name}-dashboard.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            // 520px triggers Chakra base breakpoints → all grids stack/wrap like mobile
            windowWidth: 520,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: "avoid-all" },
        } as any)
        .from(element)
        .save();
    } finally {
      // Restore normal scroll layout
      setIsPrinting(false);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // ─── React Query API Requests (Only enabled if userId & role are set) ───
  const queryPayload = useMemo(
    () => ({
      userId,
      role,
      startDate,
      endDate,
    }),
    [userId, role, startDate, endDate],
  );

  const isQueryEnabled = !!userId && !!role;

  const { data: performanceData, isLoading: loadingPerf } =
    useGetEmployeePerformance(queryPayload, isQueryEnabled);

  const { data: performanceMixData, isLoading: loadingMix } =
    useGetEmployeePerformanceMix(queryPayload, isQueryEnabled);

  const { data: activityTimelineData, isLoading: loadingTimeline } =
    useGetEmployeeActivityTimeline(queryPayload, isQueryEnabled);

  const { data: snapshotData, isLoading: loadingSnapshot } =
    useGetEmployeeLeadStatusSnapshot(queryPayload, isQueryEnabled);

  const { data: scorecardData, isLoading: loadingScorecard } =
    useGetEmployeeScorecard(queryPayload, isQueryEnabled);

  const { data: recentTimelineData, isLoading: loadingRecent } =
    useGetEmployeeRecentLeadTimeline({ userId, role }, isQueryEnabled);

  // Overall dashboard loading state
  const isDashboardLoading =
    loadingPerf ||
    loadingMix ||
    loadingTimeline ||
    loadingSnapshot ||
    loadingScorecard ||
    loadingRecent;

  // 5. Strengths & Risks Computed Highlights (Executed unconditionally to obey Rules of Hooks)
  const strengthsRisksComputed = useMemo(() => {
    console.log("scorecardData", scorecardData);
    
    const list: any[] = [];
    const followupScore =
      scorecardData?.components?.find(
        (c: any) => c.label === "Follow-up Discipline",
      )?.normalizedScore ?? 0;
    const overdueCount = performanceData?.followupDue ?? 0;
    const responseHours = performanceData?.avgResponseTimeHours ?? 0;
    const conversionScore =
      scorecardData?.components?.find(
        (c: any) => c.label === "Conversion Quality",
      )?.normalizedScore ?? 0;
    console.log("followupScore", followupScore);
    
    // A. Follow-up Discipline
    if (followupScore >= 75) {
      list.push({
        title: "High Discipline",
        desc: `Follow-up completion rate is excellent (${followupScore}%).`,
        type: "strength",
        bg: "#E8F5E9",
        border: "#C8E6C9",
        iconColor: "#2E7D32",
        icon: BsCheckCircleFill,
      });
    } else if (followupScore > 0 && followupScore < 60) {
      list.push({
        title: "Weak Discipline",
        desc: `Follow-up discipline is below target average (${followupScore}%).`,
        type: "risk",
        bg: "#FFEBEE",
        border: "#FFCDD2",
        iconColor: "#C62828",
        icon: BsBellFill,
      });
    }

    // B. Overdue Follow-ups
    if (overdueCount > 10) {
      list.push({
        title: "Overdue Follow-ups",
        desc: `${overdueCount} follow-ups are due/overdue. Take immediate action.`,
        type: "risk",
        bg: "#FFF3E0",
        border: "#FFE0B2",
        iconColor: "#E65100",
        icon: BsClockFill,
      });
    }

    // C. Response Time
    if (responseHours > 0 && responseHours <= 2) {
      list.push({
        title: "Fast First Response",
        desc: `Average response time is ${responseHours.toFixed(1)} hours, which is excellent.`,
        type: "strength",
        bg: "#E8F5E9",
        border: "#C8E6C9",
        iconColor: "#2E7D32",
        icon: BsCheckCircleFill,
      });
    } else if (responseHours > 4) {
      list.push({
        title: "Slow First Response",
        desc: `Average response time is ${responseHours.toFixed(1)} hours. Target is under 2 hours.`,
        type: "risk",
        bg: "#FFEBEE",
        border: "#FFCDD2",
        iconColor: "#C62828",
        icon: BsBellFill,
      });
    }

    // D. Conversion
    if (conversionScore >= 60) {
      list.push({
        title: "Strong Demo Conversion",
        desc: `Demo → Conversion score is ${conversionScore}% which is excellent.`,
        type: "strength",
        bg: "#E8F5E9",
        border: "#C8E6C9",
        iconColor: "#2E7D32",
        icon: BsCheckCircleFill,
      });
    }

    return list.length > 0
      ? list
      : [];
  }, [scorecardData, performanceData]);

  // Unified Dashboard Loading Screen
  if (isDashboardLoading) {
    return (
      <Center bg={bg} minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="green.500" thickness="4px" />
          <Text fontSize="sm" fontWeight={700} color={textSecondary}>
            Loading Employee Insights...
          </Text>
        </VStack>
      </Center>
    );
  }

  // ─── Data Mappers for Dashboard Widgets ───

  // 1. Profile Header Member Info
  const memberInfo = {
    name: activeStaff?.name || "Unknown Staff",
    role: activeStaff?.role?.name || role,
    avatarUrl: activeStaff?.avatarUrl || "https://bit.ly/prosper-baba",
    reportingTo: activeStaff?.managerId?.name ? `${activeStaff.managerId.name}` : "",
    joinedOn: activeStaff?.createdAt ? dayjs(activeStaff.createdAt).format("MMM DD, YYYY") : "",
    teamSize: 0,
    status: activeStaff?.status || "Active",
  };

  const dateRangeLabel = `${dayjs(startDate).format("MMM DD")} - ${dayjs(endDate).format("MMM DD")}, ${dayjs(endDate).format("YYYY")}`;

  // 2. 11 KPI Cards Row Mapping
  const kpiCards = [
    {
      label: "Assigned Leads",
      value: (performanceData?.totalAssignedLeads ?? 0).toLocaleString(),
      change: snapshotData?.total?.vsLastWeek || "0%",
      isNegative: snapshotData?.total?.trend === "down",
      icon: BsPersonPlusFill,
      color: "green",
      lightColor: "#E8F5E9",
      solidColor: "#2E7D32",
    },
    {
      label: "Touched Leads",
      value: (performanceData?.touchedLeads ?? 0).toLocaleString(),
      change: "",
      isNegative: false,
      icon: BsHandIndexFill,
      color: "blue",
      lightColor: "#E3F2FD",
      solidColor: "#1565C0",
    },
    {
      label: "Untouched Leads",
      value: (performanceData?.untouchedLeads ?? 0).toLocaleString(),
      change: "",
      isNegative: false,
      icon: BsPersonFill,
      color: "orange",
      lightColor: "#FFF3E0",
      solidColor: "#E65100",
    },
    {
      label: "Calls Done",
      value: (performanceData?.totalCalls ?? 0).toLocaleString(),
      change: "",
      isNegative: false,
      icon: BsTelephoneFill,
      color: "green",
      lightColor: "#E8F5E9",
      solidColor: "#2E7D32",
    },
    {
      label: "Followups Done",
      value: (performanceData?.followupCompleted ?? 0).toLocaleString(),
      change:
        snapshotData?.rows?.find((r: any) => r.label === "Follow-up")
          ?.vsLastWeek || "0%",
      isNegative:
        snapshotData?.rows?.find((r: any) => r.label === "Follow-up")?.trend ===
        "down",
      icon: BsClipboardCheckFill,
      color: "blue",
      lightColor: "#E3F2FD",
      solidColor: "#1565C0",
    },
    {
      label: "Followups Due",
      value: (performanceData?.followupDue ?? 0).toLocaleString(),
      change: "",
      isNegative: false,
      icon: BsBellFill,
      color: "red",
      lightColor: "#FFEBEE",
      solidColor: "#C62828",
    },
    {
      label: "Demo Scheduled",
      value: (performanceData?.demoScheduled ?? 0).toLocaleString(),
      change:
        snapshotData?.rows?.find((r: any) => r.label === "Demo Scheduled")
          ?.vsLastWeek || "0%",
      isNegative:
        snapshotData?.rows?.find((r: any) => r.label === "Demo Scheduled")
          ?.trend === "down",
      icon: BsCalendarCheckFill,
      color: "blue",
      lightColor: "#E3F2FD",
      solidColor: "#1565C0",
    },
    {
      label: "Demo Done",
      value: (performanceData?.demoDone ?? 0).toLocaleString(),
      change:
        snapshotData?.rows?.find((r: any) => r.label === "Demo Done")
          ?.vsLastWeek || "0%",
      isNegative:
        snapshotData?.rows?.find((r: any) => r.label === "Demo Done")?.trend ===
        "down",
      icon: BsTvFill,
      color: "purple",
      lightColor: "#F3E5F5",
      solidColor: "#6A1B9A",
    },
    {
      label: "Converted",
      value: (performanceData?.converted ?? 0).toLocaleString(),
      change:
        snapshotData?.rows?.find((r: any) => r.label === "Converted")
          ?.vsLastWeek || "0%",
      isNegative:
        snapshotData?.rows?.find((r: any) => r.label === "Converted")?.trend ===
        "down",
      icon: BsCheckCircleFill,
      color: "green",
      lightColor: "#E8F5E9",
      solidColor: "#2E7D32",
    },
    {
      label: "Avg Response",
      value: performanceData?.avgResponseTimeHours
        ? `${performanceData.avgResponseTimeHours.toFixed(1)} hrs`
        : "N/A",
      change: "",
      isNegative: false,
      icon: BsClockFill,
      color: "orange",
      lightColor: "#FFF3E0",
      solidColor: "#E65100",
    },
    {
      label: "Productivity",
      value: performanceData?.score ? `${performanceData.score}/100` : "N/A",
      change: "",
      isNegative: false,
      icon: BsStarFill,
      color: "purple",
      lightColor: "#F3E5F5",
      solidColor: "#6A1B9A",
    },
  ];

  // 3. Performance Mix Donut Chart Mapping
  const mixColors: Record<string, string> = {
    "Fresh Leads": "#1E88E5",
    "Follow-up Leads": "#64B5F6",
    "Demo Leads": "#9C27B0",
    "Converted Leads": "#FF9800",
  };
  const mixDataMapped = (performanceMixData?.breakdown || []).map((b: any) => ({
    name: b.label,
    value: b.count,
    pct: b.percentage,
    color: mixColors[b.label] || "#4CAF50",
  }));
  const totalLeads = String(performanceMixData?.totalLeads || 0);

  // 4. Daily Activity Timeline Chart Mapping
  const activityDataMapped = (activityTimelineData?.data || []).map(
    (day: any) => ({
      date: dayjs(day.date).format("MMM DD"),
      calls: day.callsDone,
      followups: day.followupsCompleted,
      demos: day.demoDone,
    }),
  );

  // 6. Lead Status Snapshot Table Mapping
  const snapshotDataMapped = (snapshotData?.rows || []).map((row: any) => ({
    status: row.label,
    count: String(row.count),
    pct: row.percentOfTotal,
    change: row.vsLastWeek,
    isNeg: row.trend === "down",
  }));

  // 7. Work Discipline Card Progress Mapping
  const scorecardMapped = (scorecardData?.components || []).map((comp: any) => {
    let icon = BsTelephoneFill;
    if (comp.label === "Call Coverage") icon = BsTelephoneFill;
    if (comp.label === "Follow-up Discipline") icon = BsClipboardCheckFill;
    if (comp.label === "Demo Quality") icon = BsClockFill;
    if (comp.label === "Conversion Quality") icon = BsStarFill;
    if (comp.label === "Data Discipline") icon = BsCalendarCheckFill;

    return {
      label: comp.label,
      score: comp.normalizedScore,
      color: comp.normalizedScore >= 75 ? "green" : "orange",
      icon,
      iconColor: comp.normalizedScore >= 75 ? "#2E7D32" : "#E65100",
    };
  });
  const overallScore = scorecardData?.overall?.score ?? 0;
  const overallLabel = scorecardData?.overall?.grade ?? "Average";

  // 8. Recent Lead Activity Timeline Mapping
  const timelineNodesMapped = (recentTimelineData?.timeline || []).map(
    (node: any) => {
      let title = "Lead Activity";
      let icon = BsTelephoneFill;
      let bg = "#E3F2FD";
      let iconColor = "#1565C0";

      if (node.eventType === "FIRST_CALL") {
        title = "First Call";
        icon = BsTelephoneFill;
        bg = "#E3F2FD";
        iconColor = "#1565C0";
      } else if (node.eventType === "FOLLOWUP_COMPLETED") {
        title = "Follow-up Completed";
        icon = BsClipboardCheckFill;
        bg = "#E8EAF6";
        iconColor = "#3F51B5";
      } else if (node.eventType === "DEMO_SCHEDULED") {
        title = "Demo Scheduled";
        icon = BsTvFill;
        bg = "#E3F2FD";
        iconColor = "#1565C0";
      } else if (node.eventType === "DEMO_DONE") {
        title = "Demo Done";
        icon = BsTvFill;
        bg = "#F3E5F5";
        iconColor = "#6A1B9A";
      } else if (node.eventType === "CONVERTED") {
        title = "Converted";
        icon = BsCheckCircleFill;
        bg = "#E8F5E9";
        iconColor = "#2E7D32";
      }

      return {
        title,
        subtitle: `Lead: ${node.leadName || "Unknown"} ${node.leadSource ? ` •  Source: ${node.leadSource}` : ""}`,
        time: dayjs(node.dateTime).format("MMM DD, YYYY hh:mm A"),
        value: node.amount ? `₹ ${node.amount.toLocaleString()}` : undefined,
        icon,
        bg,
        iconColor,
      };
    },
  );

  return (
    <Box
      ref={dashboardRef}
      bg={bg}
      minH="100vh"
      p={{ base: 4, md: 5 }}
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {/* 1. Interactive Header & Filters Panel */}
      <ProfileHeader
        cardBg={cardBg}
        border={border}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        memberInfo={memberInfo}
        score={overallScore}
        scoreLabel={overallLabel}
        dateRangeLabel={dateRangeLabel}
        staffList={hasSubordinates ? hierarchyList : []}
        selectedStaffId={selectedStaff?._id || ""}
        onStaffChange={(opt: any) => {
          if (!opt) { setSelectedStaff(null); return; }
          const found = hierarchyList.find((s: any) => s._id === opt.value);
          setSelectedStaff(found || null);
        }}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onExportReport={handleExportReport}
      />

      {/* 2. 11 KPI Cards Row */}
      <KpiScrollRow kpis={kpiCards} printMode={isPrinting} />

      {/* 3. Analytical Section: Performance Mix, Timeline, Highlights */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1.6fr 1.15fr" }}
        gap={4}
        mb={5}
      >
        <PerformanceMixCard
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          mixData={mixDataMapped}
          totalLeads={totalLeads}
        />
        <DailyActivityChart
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          activityData={activityDataMapped}
          onPeriodChange={(period) =>
            console.log(`Time period set to: ${period}`)
          }
        />
        <StrengthsRisksCard
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          strengthsRisks={strengthsRisksComputed}
          onItemClick={(item) =>
            console.log(`Strength/Risk clicked: ${item.title}`)
          }
        />
      </Grid>

      {/* 4. Bottom Data Grid: Snapshot, Scorecard, Recent Feed */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          xl: "1.3fr 1.3fr 1.3fr",
        }}
        gap={4}
      >
        <LeadStatusTable
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          snapshotData={snapshotDataMapped}
          totalLeads={String(snapshotData?.total?.count ?? 0)}
          totalPct={snapshotData?.total?.percentOfTotal || "100%"}
          totalChange={snapshotData?.total?.vsLastWeek || "0%"}
        />
        <WorkDisciplineCard
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          scorecardData={scorecardMapped}
          overallScore={overallScore}
          overallLabel={overallLabel}
        />
        <RecentLeadTimelineCard
          cardBg={cardBg}
          border={border}
          textPrimary={textPrimary}
          timelineNodes={timelineNodesMapped}
          onViewAllClick={() => console.log("Viewing all timeline activity...")}
        />
      </Grid>
    </Box>
  );
};

export default PersonXRayDashboard;
