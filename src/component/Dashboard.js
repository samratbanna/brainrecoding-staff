import { PageHeading } from "@/common/PageHeading";
import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Select,
  Text,
} from "@chakra-ui/react";
import { filter, find, map, sumBy } from "lodash";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { useLeadStore } from "@/store/lead";
import { useEffect, useState } from "react";
import { LoadingContainer } from "../common/LoadingContainer";
import { useLoginStore } from "@/store/login";
import { LEADSTATUS, STATUS } from "@/constant";
import { Controller, useForm } from "react-hook-form";
import {
  PhoneIcon,
  TimeIcon,
  QuestionOutlineIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowForwardIcon,
  CheckCircleIcon,
  CalendarIcon,
  StarIcon,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  RepeatIcon,
  SpinnerIcon,
} from "@chakra-ui/icons";
import { FiPhoneOff } from "react-icons/fi";
import { ResponsivePie } from "@nivo/pie";

import { useGetBottomHeirarchy, useGetTopHeirarchy } from "@/services/staff.service";

const statuses = [
  { label: "PENDING", color: "orange.50", icon: TimeIcon },
  { label: "RINGING", color: "yellow.50", icon: PhoneIcon },
  { label: "WRONG_NUMBER", color: "gray.50", icon: FiPhoneOff },
  { label: "DUPLICATE", color: "gray.100", icon: RepeatIcon },
  { label: "NOT_INTERESTED", color: "red.50", icon: CloseIcon },
  { label: "LOW_FOLLOWUP", color: "blue.50", icon: ChevronDownIcon },
  { label: "MED_FOLLOWUP", color: "blue.100", icon: ChevronRightIcon },
  { label: "HIGH_FOLLOWUP", color: "blue.200", icon: ArrowForwardIcon },
  { label: "MEETING_SCHEDULED", color: "purple.50", icon: CalendarIcon },
  { label: "DEMO_SCHEDULED", color: "cyan.50", icon: StarIcon },
  { label: "IN_PROCESS", color: "blue.50", icon: SpinnerIcon },
  { label: "REJECTED", color: "red.100", icon: WarningIcon },
  { label: "CONVERTED", color: "green.50", icon: CheckIcon },
  { label: "NON_CONTACTABLE", color: "green.50", icon: CloseIcon },
];

export const Dashboard = () => {
  const [finalData, setFinalData] = useState();
  const [teamLeader, setTeamLeader] = useState([]);
  const [trainers, setTrainers] = useState();
  const { userData } = useLoginStore((s) => ({
    userData: s.userData,
  }));

  const { data: teamList, isLoading } = useGetBottomHeirarchy({ staffId: userData?._id });
  console.log("teamList", teamList);

  const { getDashboardAction, dashboardData, getDashboardStatus } =
    useLeadStore((s) => ({
      getDashboardAction: s.getDashboardAction,
      dashboardData: s.dashboardData,
      getDashboardStatus: s.getDashboardStatus,
    }));

  const { control, getValues, watch, handleSubmit, setValue } = useForm();
  const {
    getTeam,
    teamStatus,
    getTeamDashboard,
    teamReportStatus,
    teamDashboard,
  } = useLeadStore();

  useEffect(() => {
    if (userData && userData?._id) {
      getDashboardAction({ staffId: userData?._id });
      getTeamDashboard({ staffId: userData?._id });
    }
  }, [getDashboardAction, userData]);

  console.log("userData", userData);

  const growthPartnerId = watch("growthPartner");
  const teamLeaderId = watch("teamLead");
  const trainerId = watch("trainer");

  useEffect(() => {
    if (teamLeaderId) {
      const trainerList = filter(teamList, (staff) => {
        console.log(
          "staff.districtManagerId",
          teamList,
          staff.districtManagerId,
          teamLeaderId
        );

        return staff.districtManagerId === teamLeaderId;
      });
      setTrainers(trainerList);
      // getTeamDashboard({ teamLeaderId });
    }
  }, [teamLeaderId]);

  useEffect(() => {
    if (trainerId) {
      // getTeamDashboard({ trainerId });
    }
  }, [trainerId]);

  useEffect(() => {
    getTeam();
  }, []);

  useEffect(() => {
    if (growthPartnerId) {
      const teamLeadList = filter(
        teamList,
        (staff) =>
          staff.stateManagerId === growthPartnerId &&
          staff?.role === "TEAM_LEADER"
      );
      setTeamLeader(teamLeadList);
      // getTeamDashboard({ growthPartnerId });
    }
  }, [growthPartnerId]);

  useEffect(() => {
    console.log("userData?.role", userData?.role);
    if (userData?.role === "GROWTH_PARTNER") {
      const teamLeadList = filter(teamList, (staff) => {
        console.log("staff", staff?.stateManagerId, userData?._id, staff?.role);
        return (
          staff.stateManagerId === userData?._id &&
          staff?.role === "TEAM_LEADER"
        );
      });
      console.log("teamLeadList", teamLeadList);

      // getTeamDashboard({ growthPartnerId: userData?._id });

      setTeamLeader(teamLeadList);
    } else if (userData?.role === "TEAM_LEADER") {
      const trainerList = filter(
        teamList,
        (staff) =>
          staff.districtManagerId === userData?._id && staff?.role === "TRAINER"
      );
      setTrainers(trainerList);
      // getTeamDashboard({ teamLeaderId: userData?._id });
    } else {
      // getTeamDashboard({ trainerId: userData?._id });
    }
  }, [userData?.role, teamList]);

  useEffect(() => {
    if (dashboardData) {
      const todayLead = sumBy(
        dashboardData.todayLead,
        (lead) => lead.leadCount
      );

      const todayConverted = find(
        dashboardData.todayLead,
        (lead) => lead?._id === true
      )?.leadCount;

      const totalLead = sumBy(
        dashboardData.totalLead,
        (lead) => lead.leadCount
      );

      const totalConverted = find(
        dashboardData.totalLead,
        (lead) => lead?._id === true
      )?.leadCount;

      const totalCommission = find(
        dashboardData.totalAmount,
        (lead) => lead?._id === "CREDIT"
      )?.totalEarn;

      const totalPaidCommission = find(
        dashboardData.totalAmount,
        (lead) => lead?._id === "DEBIT"
      )?.totalEarn;

      const todayCommission = find(
        dashboardData.todayTotalAmount,
        (lead) => lead?._id === "CREDIT"
      )?.totalEarn;

      const todayPaidCommission = find(
        dashboardData.todayTotalAmount,
        (lead) => lead?._id === "DEBIT"
      )?.totalEarn;

      const d = {
        todayLead,
        todayConverted,
        totalLead,
        totalConverted,
        totalCommission,
        todayCommission,
        totalPaidCommission,
        todayPaidCommission,
      };

      setFinalData(d);
    }
  }, [dashboardData]);

  const TODAY_EARNING = [
    {
      title: "Commission",
      total: finalData?.todayCommission || 0,
      icon: <FaChalkboardTeacher fontSize="34px" color="white" />,
      bg: "#9AE6B4",
    },
    {
      title: "Paid",
      total: finalData?.todayPaidCommission || 0,
      icon: <MdOutlineFeedback fontSize="34px" color="white" />,
      bg: "#6ca18c",
    },
  ];

  const TOTAL_EARNING = [
    {
      title: "Commission",
      total: finalData?.totalCommission || 0,
      icon: <FaChalkboardTeacher fontSize="34px" color="white" />,
      bg: "#9AE6B4",
    },
    {
      title: "Paid",
      total: finalData?.totalPaidCommission || 0,
      icon: <MdOutlineFeedback fontSize="34px" color="white" />,
      bg: "#6ca18c",
    },
    {
      title: "Pending",
      total: finalData?.totalCommission - finalData?.totalPaidCommission || 0,
      icon: <MdOutlineFeedback fontSize="34px" color="white" />,
      bg: "#6ca18c",
    },
  ];

  const TOTAL_LEADS = [
    {
      title: "Leads",
      total: finalData?.totalLead || 0,
      icon: <FaChalkboardTeacher fontSize="34px" color="white" />,
      bg: "#9AE6B4",
    },
    {
      title: "Converted",
      total: finalData?.totalConverted || 0,
      icon: <MdOutlineFeedback fontSize="34px" color="white" />,
      bg: "#6ca18c",
    },
  ];

  const TODAY_LEADS = [
    {
      title: "Leads",
      total: finalData?.todayLead || 0,
      icon: <FaChalkboardTeacher fontSize="34px" color="white" />,
      bg: "#9AE6B4",
    },
    {
      title: "Converted",
      total: finalData?.todayConverted || 0,
      icon: <MdOutlineFeedback fontSize="34px" color="white" />,
      bg: "#6ca18c",
    },
  ];

  return getDashboardStatus === STATUS.FETCHING ? (
    <LoadingContainer loading={getDashboardStatus === STATUS.FETCHING} />
  ) : (
    <Box bg="white" p={3} minH="100vh">
      <PageHeading heading="Dashboard" />
      <DashboardSection dataArray={TODAY_LEADS} title={"Today Lead"} />
      <DashboardSection dataArray={TODAY_EARNING} title={"Today Commission"} />
      <DashboardSection dataArray={TOTAL_LEADS} title={"Total Lead"} />
      <DashboardSection dataArray={TOTAL_EARNING} title={"Total Commission"} />

      {/* <Box>
        <Text fontSize={20} fontWeight={500} mb={5}>
          {"Team Dashboard"}
        </Text>
        <HStack>
          <Controller
            name="teamLead"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Team Member"
                size="sm"
                w="200px"
              >
                {map(teamList, (staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </HStack>
        <Flex wrap="wrap" gap={4} mt={5}>
          {statuses.map(({ label, color, icon }) => {
            const status = find(LEADSTATUS, (l) => l.id === label);
            const count = find(teamDashboard, (team) => team?.status === label);
            return (
              <Box
                key={label}
                bg={color}
                p={4}
                py={5}
                borderRadius="md"
                boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
                width="200px"
                height="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                // onClick={() => router.push({
                //   pathname: '/app/lead',
                //   query: { growthPartnerId, teamLeaderId, trainerId }, // Pass parameters
                // })}
                _hover={{
                  transform: "scale(1.05)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Icon as={icon} boxSize={6} mb={2} mt={3} />
                <Text fontSize="3xl" fontWeight={"bold"} color="black">
                  {count?.count ?? "0"}
                </Text>
                <Text fontWeight="bold" color="gray.700">
                  {status ? status?.title : label}
                </Text>
              </Box>
            );
          })}
        </Flex>

        

      </Box> */}

        <Box
          p={5}
          mt={10}
          width="50%"
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          height="500px"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Team Dashboard
            </Text>

            {/* Team Member Select inside the chart box */}
            <Controller
              name="teamLead"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Team Member"
                  size="sm"
                  width="200px"
                >
                  {map(teamList, (staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </Select>
              )}
            />
          </Flex>

          <ResponsivePie
            data={statuses.map((item) => {
              const count =
                find(teamDashboard, (team) => team?.status === item.label)?.count || 0;
              return {
                id: item.label,
                label:
                  item.label
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase()) + ` (${count})`,
                value: count,
                color: item.color,
              };
            })}
            margin={{ top: 40, right: 30, bottom: 40, left: 10 }}
            innerRadius={0.5}
            padAngle={1}
            cornerRadius={4}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          />
        </Box>

    </Box>
  );
};

const DashboardSection = ({ dataArray, title }) => {
  return (
    <Box>
      <Text fontSize={20} fontWeight={500}>
        {title}
      </Text>
      <LoadingContainer loading={false}>
        <Flex
          w="100%"
          justify="flex-start"
          flexDir={{ base: "column", md: "row", lg: "row" }}
        >
          {map(dataArray, (d, index) => (
            <DashboardItem d={d} index={index} />
          ))}
        </Flex>
      </LoadingContainer>
    </Box>
  );
};

const DashboardItem = ({ d, index }) => {
  return (
    <Flex
      w="25%"
      minW="240px"
      mr={10}
      my={4}
      border="1px solid"
      borderColor="white"
      bg={d.bg}
      borderRadius="6px"
    >
      <Box key={index} flex={3 / 4} borderLeftRadius="6px" px={4} py={6}>
        <HStack align="start">
          <Center
            w="fit-content"
            minW="60px"
            h="30px"
            p={1}
            borderRadius={6}
            bg="white"
          >
            <Text fontSize={20} fontWeight={500}>
              {d.total}
            </Text>
          </Center>
          <Text fontSize={20} fontWeight={500} color="white">
            {d.title}
          </Text>
        </HStack>
      </Box>
      <Center
        flex={1 / 4}
        px="10px"
        borderRightRadius="6px"
        borderLeft="1px solid"
        borderColor="white"
      >
        {d.icon}
      </Center>
    </Flex>
  );
};
