import React from "react";
import { Box, Flex, Icon, Center, Text, HStack } from "@chakra-ui/react";
import {
  BsPersonPlusFill,
  BsHandIndexFill,
  BsPersonFill,
  BsTelephoneFill,
  BsClipboardCheckFill,
  BsBellFill,
  BsCalendarCheckFill,
  BsTvFill,
  BsCheckCircleFill,
  BsClockFill,
  BsStarFill,
} from "react-icons/bs";

export interface KpiItem {
  label: string;
  value: string;
  change: string;
  isNegative: boolean;
  icon: React.ComponentType<any>;
  color: string;
  lightColor: string;
  solidColor: string;
}

interface KpiScrollRowProps {
  kpis?: KpiItem[];
  printMode?: boolean;
}

const defaultKpis: KpiItem[] = [
  {
    label: "Assigned Leads",
    value: "1,256",
    change: "+14.6%",
    isNegative: false,
    icon: BsPersonPlusFill,
    color: "green",
    lightColor: "#E8F5E9",
    solidColor: "#2E7D32",
  },
  {
    label: "Touched Leads",
    value: "874",
    change: "+16.3%",
    isNegative: false,
    icon: BsHandIndexFill,
    color: "blue",
    lightColor: "#E3F2FD",
    solidColor: "#1565C0",
  },
  {
    label: "Untouched Leads",
    value: "382",
    change: "-8.1%",
    isNegative: true,
    icon: BsPersonFill,
    color: "orange",
    lightColor: "#FFF3E0",
    solidColor: "#E65100",
  },
  {
    label: "Calls Done",
    value: "612",
    change: "+18.7%",
    isNegative: false,
    icon: BsTelephoneFill,
    color: "green",
    lightColor: "#E8F5E9",
    solidColor: "#2E7D32",
  },
  {
    label: "Follow-ups Completed",
    value: "486",
    change: "+21.4%",
    isNegative: false,
    icon: BsClipboardCheckFill,
    color: "blue",
    lightColor: "#E3F2FD",
    solidColor: "#1565C0",
  },
  {
    label: "Overdue Follow-ups",
    value: "68",
    change: "-12.5%",
    isNegative: true,
    icon: BsBellFill,
    color: "red",
    lightColor: "#FFEBEE",
    solidColor: "#C62828",
  },
  {
    label: "Demo Scheduled",
    value: "146",
    change: "+20.3%",
    isNegative: false,
    icon: BsCalendarCheckFill,
    color: "blue",
    lightColor: "#E3F2FD",
    solidColor: "#1565C0",
  },
  {
    label: "Demo Done",
    value: "92",
    change: "+25.9%",
    isNegative: false,
    icon: BsTvFill,
    color: "purple",
    lightColor: "#F3E5F5",
    solidColor: "#6A1B9A",
  },
  {
    label: "Converted",
    value: "41",
    change: "+24.2%",
    isNegative: false,
    icon: BsCheckCircleFill,
    color: "green",
    lightColor: "#E8F5E9",
    solidColor: "#2E7D32",
  },
  {
    label: "Avg. Response Time",
    value: "3m 24s",
    change: "-18.4%",
    isNegative: true,
    icon: BsClockFill,
    color: "orange",
    lightColor: "#FFF3E0",
    solidColor: "#E65100",
  },
  {
    label: "Productivity Score",
    value: "86/100",
    change: "+9.3%",
    isNegative: false,
    icon: BsStarFill,
    color: "purple",
    lightColor: "#F3E5F5",
    solidColor: "#6A1B9A",
  },
];

export const KpiCard: React.FC<{ item: KpiItem }> = ({ item }) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.150"
      borderRadius="xl"
      p={2.5}
      shadow="sm"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
    >
      <Flex align="center" gap={2}>
        <Center w="34px" h="34px" bg={item.lightColor} borderRadius="full" flexShrink={0}>
          <Icon as={item.icon} color={item.solidColor} boxSize={4} />
        </Center>
        <Box flex={1} overflow="hidden">
          <Text fontSize="8.5px" color="gray.500" fontWeight={750} mb={0.5} noOfLines={1} textTransform="uppercase">
            {item.label}
          </Text>
          <Text fontSize="md" fontWeight={850} color="gray.850" noOfLines={1} lineHeight={1.1}>
            {item.value}
          </Text>
        </Box>
      </Flex>
      <HStack mt={2.5} spacing={1} align="center" pl={0.5}>
        <Text
          fontSize="9px"
          color={item.isNegative ? "red.600" : "green.600"}
          fontWeight={800}
          whiteSpace="nowrap"
        >
          {item.isNegative ? "↓" : "↑"} {item.change.replace(/[+-]/, "")}
        </Text>
        <Text fontSize="8px" color="gray.400" fontWeight={600} whiteSpace="nowrap">
          vs Apr 28 - May 04
        </Text>
      </HStack>
    </Box>
  );
};

export const KpiScrollRow: React.FC<KpiScrollRowProps> = ({ kpis = defaultKpis, printMode = false }) => {
  if (printMode) {
    return (
      <Flex flexWrap="wrap" gap={2.5} mb={5}>
        {kpis.map((item) => (
          <Box key={item.label} flex="0 0 calc(25% - 8px)" minW="0">
            <KpiCard item={item} />
          </Box>
        ))}
      </Flex>
    );
  }

  return (
    <Flex
      overflowX="auto"
      gap={2.5}
      pb={2.5}
      mb={5}
      css={{
        "&::-webkit-scrollbar": { height: "5px" },
        "&::-webkit-scrollbar-track": { background: "#F0F2F5", borderRadius: "10px" },
        "&::-webkit-scrollbar-thumb": { background: "#CBD5E1", borderRadius: "10px" },
        "&::-webkit-scrollbar-thumb:hover": { background: "#94A3B8" },
      }}
    >
      {kpis.map((item) => (
        <Box key={item.label} minW={{ base: "140px", md: "155px" }} flex="1 0 auto">
          <KpiCard item={item} />
        </Box>
      ))}
    </Flex>
  );
};
