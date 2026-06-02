import React from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export interface LeadSnapshotRow {
  status: string;
  count: string;
  pct: string;
  change: string;
  isNeg: boolean;
}

interface LeadStatusTableProps {
  snapshotData?: LeadSnapshotRow[];
  totalLeads?: string;
  totalPct?: string;
  totalChange?: string;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

const defaultSnapshotData: LeadSnapshotRow[] = [
  { status: "New / Fresh", count: "528", pct: "42%", change: "↑ 14.6%", isNeg: false },
  { status: "Contacted", count: "346", pct: "27.5%", change: "↑ 10.1%", isNeg: false },
  { status: "Follow-up", count: "212", pct: "16.9%", change: "↑ 3.2%", isNeg: false },
  { status: "Demo Scheduled", count: "146", pct: "11.6%", change: "↑ 6.8%", isNeg: false },
  { status: "Demo Done", count: "92", pct: "7.3%", change: "↑ 5.7%", isNeg: false },
  { status: "Converted", count: "41", pct: "3.3%", change: "↑ 4.2%", isNeg: false },
  { status: "Lost / Not Interested", count: "23", pct: "1.8%", change: "↓ 0.9%", isNeg: true },
];

export const LeadStatusTable: React.FC<LeadStatusTableProps> = ({
  snapshotData = defaultSnapshotData,
  totalLeads = "1,256",
  totalPct = "100%",
  totalChange = "↑ 9.7%",
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
      <Text fontWeight={800} fontSize="sm" color={textPrimary} mb={4}>
        Lead Status Snapshot
      </Text>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th fontSize="10px" color="gray.600" py={3} px={3} fontWeight={700} textTransform="none" letterSpacing="normal">
                Status
              </Th>
              <Th fontSize="10px" color="gray.600" py={3} px={3} fontWeight={700} textTransform="none" letterSpacing="normal" isNumeric>
                Count
              </Th>
              <Th fontSize="10px" color="gray.600" py={3} px={3} fontWeight={700} textTransform="none" letterSpacing="normal" isNumeric>
                % of Total
              </Th>
              <Th fontSize="10px" color="gray.600" py={3} px={3} fontWeight={700} textTransform="none" letterSpacing="normal" isNumeric>
                vs Last Week
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {snapshotData.map((row) => (
              <Tr key={row.status}>
                <Td fontSize="11px" fontWeight={500} color="gray.700" py={3} px={3}>
                  {row.status}
                </Td>
                <Td fontSize="11px" fontWeight={600} color="gray.850" py={3} px={3} isNumeric>
                  {row.count}
                </Td>
                <Td fontSize="11px" fontWeight={500} color="gray.500" py={3} px={3} isNumeric>
                  {row.pct}
                </Td>
                <Td fontSize="11px" fontWeight={600} color={row.isNeg ? "red.500" : "green.500"} py={3} px={3} isNumeric>
                  {row.change}
                </Td>
              </Tr>
            ))}
            <Tr bg="gray.50" fontWeight={700}>
              <Td fontSize="11px" fontWeight={700} color="gray.800" py={3} px={3}>
                Total
              </Td>
              <Td fontSize="11px" fontWeight={700} color="gray.800" py={3} px={3} isNumeric>
                {totalLeads}
              </Td>
              <Td fontSize="11px" fontWeight={700} color="gray.500" py={3} px={3} isNumeric>
                {totalPct}
              </Td>
              <Td fontSize="11px" fontWeight={700} color="green.500" py={3} px={3} isNumeric>
                {totalChange}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
