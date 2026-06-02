import React from "react";
import { Box, Flex, Text, VStack, Center, Icon, Badge } from "@chakra-ui/react";
import {
  BsTelephoneFill,
  BsClipboardCheckFill,
  BsTvFill,
  BsCheckCircleFill,
} from "react-icons/bs";

export interface TimelineNode {
  title: string;
  subtitle: string;
  time: string;
  value?: string;
  icon: React.ComponentType<any>;
  bg: string;
  iconColor: string;
}

interface RecentLeadTimelineCardProps {
  timelineNodes?: TimelineNode[];
  onViewAllClick?: () => void;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

const defaultTimelineNodes: TimelineNode[] = [
  {
    title: "First Call",
    subtitle: "Lead: Rajesh Verma  •  Source: Facebook",
    time: "May 11, 2025 10:42 AM",
    icon: BsTelephoneFill,
    bg: "#E3F2FD",
    iconColor: "#1565C0",
  },
  {
    title: "Follow-up Completed",
    subtitle: "Lead: Pooja Sharma  •  Source: Instagram",
    time: "May 11, 2025 09:18 AM",
    icon: BsClipboardCheckFill,
    bg: "#E8EAF6",
    iconColor: "#3F51B5",
  },
  {
    title: "Demo Scheduled",
    subtitle: "Lead: Aman Gupta  •  Source: Website",
    time: "May 10, 2025 04:30 PM",
    icon: BsTvFill,
    bg: "#E3F2FD",
    iconColor: "#1565C0",
  },
  {
    title: "Demo Done",
    subtitle: "Lead: Neha Singh  •  Source: Referral",
    time: "May 10, 2025 03:25 PM",
    icon: BsTvFill,
    bg: "#F3E5F5",
    iconColor: "#6A1B9A",
  },
  {
    title: "Converted",
    subtitle: "Lead: Suresh Nair  •  Package: Pro Plan",
    time: "May 09, 2025 11:05 AM",
    value: "₹ 48,000",
    icon: BsCheckCircleFill,
    bg: "#E8F5E9",
    iconColor: "#2E7D32",
  },
];

export const RecentLeadTimelineCard: React.FC<RecentLeadTimelineCardProps> = ({
  timelineNodes = defaultTimelineNodes,
  onViewAllClick,
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
      <Flex justify="space-between" align="center" mb={4.5}>
        <Text fontWeight={800} fontSize="sm" color={textPrimary}>
          Recent Lead Timeline
        </Text>
        {/* <Text
          fontSize="xs"
          color="blue.600"
          fontWeight={800}
          cursor="pointer"
          _hover={{ textDecor: "underline" }}
          onClick={onViewAllClick}
        >
          View All
        </Text> */}
      </Flex>

      <VStack spacing={0} align="stretch" pl={1} position="relative">
        {timelineNodes.map((node, nIdx) => (
          <Flex key={nIdx} gap={3} position="relative" pb={nIdx < timelineNodes.length - 1 ? 5.5 : 0}>
            {/* Timeline vertical connector line */}
            {nIdx < timelineNodes.length - 1 && (
              <Box
                position="absolute"
                left="15px"
                top="32px"
                w="2px"
                h="calc(100% - 16px)"
                bg="gray.150"
                zIndex={0}
              />
            )}
            {/* Timeline Node circular icon */}
            <Center w="32px" h="32px" bg={node.bg} borderRadius="full" flexShrink={0} zIndex={1} shadow="xs">
              <Icon as={node.icon} color={node.iconColor} boxSize={4} />
            </Center>
            {/* Timeline Node Content */}
            <Flex justify="space-between" align="center" flex={1} overflow="hidden">
              <Box overflow="hidden" pr={1}>
                <Text fontSize="xs" fontWeight={850} color="gray.850" noOfLines={1} lineHeight={1.1}>
                  {node.title}
                </Text>
                <Text fontSize="9px" color="gray.450" fontWeight={650} noOfLines={1} mt={0.5}>
                  {node.subtitle}
                </Text>
              </Box>
              <VStack align="end" spacing={1} flexShrink={0}>
                <Text fontSize="8px" color="gray.400" fontWeight={600} whiteSpace="nowrap">
                  {node.time.split("  ")[0]}
                </Text>
                {node.value && (
                  <Badge colorScheme="green" fontSize="9px" fontWeight={900} px={1.5} borderRadius="md" py={0.5}>
                    {node.value}
                  </Badge>
                )}
              </VStack>
            </Flex>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
