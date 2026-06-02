import React from "react";
import { Box, HStack, Text, Icon, Divider, Flex, VStack } from "@chakra-ui/react";
import { BsInfoCircleFill } from "react-icons/bs";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string> & { payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      px={3}
      py={2}
      shadow="md"
      fontSize="10px"
      fontWeight={700}
      color="gray.700"
      pointerEvents="none"
    >
      <Text fontWeight={800} color="gray.800" mb={0.5}>{item.name}</Text>
      <Text>{item.value} Leads</Text>
    </Box>
  );
};

export interface PerformanceMixItem {
  name: string;
  value: number;
  pct: string;
  color: string;
}

interface PerformanceMixCardProps {
  mixData?: PerformanceMixItem[];
  totalLeads?: string;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

const defaultMixData: PerformanceMixItem[] = [
  { name: "Fresh Leads", value: 528, pct: "42%", color: "#1E88E5" },
  { name: "Follow-up Leads", value: 478, pct: "38%", color: "#64B5F6" },
  { name: "Demo Leads", value: 151, pct: "12%", color: "#9C27B0" },
  { name: "Converted Leads", value: 99, pct: "8%", color: "#FF9800" },
];

export const PerformanceMixCard: React.FC<PerformanceMixCardProps> = ({
  mixData = defaultMixData,
  totalLeads = "1,256",
  cardBg = "white",
  border = "gray.200",
  textPrimary = "gray.850",
}) => {
  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={border}
      borderRadius="xl"
      p={4}
      shadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight={800} fontSize="sm" color={textPrimary}>
            Performance Mix
          </Text>
          <Icon as={BsInfoCircleFill} color="gray.400" boxSize={3.5} />
        </HStack>

        <Box position="relative" height="130px" display="flex" justifyItems="center" alignContent="center" mb={2}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mixData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={56}
                dataKey="value"
                paddingAngle={3}
              >
                {mixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center donut text */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            pointerEvents="none"
          >
            <Text fontSize="md" fontWeight={900} color="gray.800" lineHeight={1.1}>
              {totalLeads}
            </Text>
            <Text fontSize="8px" color="gray.400" fontWeight={700} textTransform="uppercase">
              Total Leads
            </Text>
          </Box>
        </Box>

        {/* Mix Legend Table */}
        <VStack spacing={1} align="stretch" px={1}>
          {mixData.map((s) => (
            <Flex key={s.name} justify="space-between" align="center">
              <HStack spacing={2}>
                <Box w="6px" h="6px" borderRadius="full" bg={s.color} />
                <Text fontSize="10px" color="gray.500" fontWeight={700}>
                  {s.name}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Text fontSize="10px" fontWeight={800} color="gray.800">
                  {s.pct}
                </Text>
                <Text fontSize="9px" color="gray.400" fontWeight={650}>
                  ({s.value})
                </Text>
              </HStack>
            </Flex>
          ))}
          <Divider borderColor="gray.100" my={1} />
          <Flex justify="space-between" align="center" px={1}>
            <Text fontSize="10px" fontWeight={850} color="gray.700">
              Total
            </Text>
            <HStack spacing={1}>
              <Text fontSize="10px" fontWeight={850} color="gray.850">
                100%
              </Text>
              <Text fontSize="9px" color="gray.400" fontWeight={700}>
                ({totalLeads})
              </Text>
            </HStack>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};
