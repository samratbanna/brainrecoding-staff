import React from "react";
import { Box, Flex, Text, Select, HStack } from "@chakra-ui/react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

export interface ActivityTimelineItem {
  date: string;
  calls: number;
  followups: number;
  demos: number;
}

interface DailyActivityChartProps {
  activityData?: ActivityTimelineItem[];
  onPeriodChange?: (period: string) => void;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

export const DailyActivityChart: React.FC<DailyActivityChartProps> = ({
  activityData = [],
  onPeriodChange,
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
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight={800} fontSize="sm" color={textPrimary}>
          Daily Activity Timeline
        </Text>
        {/* <Select
          size="xs"
          w="90px"
          borderRadius="md"
          defaultValue="daily"
          fontWeight={600}
          onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </Select> */}
      </Flex>

      {/* Line Ticks Legends */}
      <HStack spacing={4} mb={4} px={1}>
        {[
          { color: "#2E7D32", label: "Calls Done" },
          { color: "#1976D2", label: "Follow-ups Completed" },
          { color: "#9C27B0", label: "Demo Done" },
        ].map((l) => (
          <HStack key={l.label} spacing={1.5}>
            <Box w="8px" h="8px" bg={l.color} borderRadius="full" />
            <Text fontSize="9px" color="gray.500" fontWeight={700}>
              {l.label}
            </Text>
          </HStack>
        ))}
      </HStack>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={195}>
        <LineChart data={activityData} margin={{ left: -20, right: 10, top: 10, bottom: 45 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 700, fill: "#718096" }} tickLine={false} angle={-65} textAnchor="end" interval={0} />
          <YAxis
            tick={{ fontSize: 9, fontWeight: 700, fill: "#718096" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#2E7D32"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#2E7D32", strokeWidth: 1, fill: "white" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="followups"
            stroke="#1976D2"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#1976D2", strokeWidth: 1, fill: "white" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="demos"
            stroke="#9C27B0"
            strokeWidth={2}
            dot={{ r: 3, stroke: "#9C27B0", strokeWidth: 1, fill: "white" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
