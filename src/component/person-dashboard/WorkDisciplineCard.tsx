import React from "react";
import { Box, Flex, HStack, Text, Icon, VStack, Center, Progress } from "@chakra-ui/react";
import { BsInfoCircleFill, BsTelephoneFill, BsClipboardCheckFill, BsClockFill, BsGraphUpArrow, BsCalendarCheckFill } from "react-icons/bs";

export interface ScorecardItem {
  label: string;
  score: number;
  color: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}

interface WorkDisciplineCardProps {
  scorecardData?: ScorecardItem[];
  overallScore?: number;
  overallLabel?: string;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

const defaultScorecardData: ScorecardItem[] = [
  { label: "Call Coverage", score: 84, color: "green", icon: BsTelephoneFill, iconColor: "#2E7D32" },
  { label: "Follow-up Discipline", score: 89, color: "green", icon: BsClipboardCheckFill, iconColor: "#2E7D32" },
  { label: "Demo Quality", score: 88, color: "green", icon: BsClockFill, iconColor: "#E65100" },
  { label: "Conversion Quality", score: 82, color: "green", icon: BsGraphUpArrow, iconColor: "#2E7D32" },
  { label: "Data Discipline", score: 79, color: "orange", icon: BsCalendarCheckFill, iconColor: "#1565C0" },
];

export const WorkDisciplineCard: React.FC<WorkDisciplineCardProps> = ({
  scorecardData = defaultScorecardData,
  overallScore = 84,
  overallLabel = "Excellent",
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
        <HStack justify="space-between" mb={8}>
          <HStack spacing={1.5} align="center">
            <Text fontWeight={800} fontSize="sm" color={textPrimary}>
              Work Discipline Scorecard
            </Text>
            <Icon as={BsInfoCircleFill} color="gray.350" boxSize={3.5} />
          </HStack>
        </HStack>

        <VStack spacing={4} align="stretch" px={1}>
          {scorecardData.map((bar) => (
            <Flex key={bar.label} align="center" gap={3}>
              {/* Metric Icon */}
              <Center w="24px" h="24px" flexShrink={0}>
                <Icon as={bar.icon} color={bar.iconColor} boxSize={5} />
              </Center>

              {/* Metric Label */}
              <Text fontSize="11px" fontWeight={650} color="gray.700" w="120px" flexShrink={0}>
                {bar.label}
              </Text>

              {/* Progress bar in center */}
              <Box flex={1} mx={1.5}>
                <Progress
                  value={bar.score}
                  size="xs"
                  borderRadius="full"
                  bg="gray.100"
                  sx={{
                    "& > div": {
                      backgroundColor: bar.color === "green" ? "#2E7D32" : "#FFB300",
                    }
                  }}
                />
              </Box>

              {/* Metric Score fraction */}
              <HStack spacing={0.5} w="55px" justify="end" flexShrink={0}>
                <Text fontSize="12px" fontWeight={800} color={bar.color === "green" ? "green.600" : "orange.500"}>
                  {bar.score}
                </Text>
                <Text fontSize="9px" color="gray.400" fontWeight={650}>
                  /100
                </Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Box>

      <Flex
        bg="green.50"
        border="1px solid"
        borderColor="green.100"
        borderRadius="xl"
        p={3}
        justify="space-between"
        align="center"
        mt={5}
      >
        <Text fontSize="11px" fontWeight={750} color="green.800">
          Overall Discipline Score
        </Text>
        <HStack
          bg="white"
          border="1.5px solid"
          borderColor="#A5D6A7"
          borderRadius="lg"
          px={3}
          py={1}
          spacing={0.5}
        >
          <Text fontSize="12px" fontWeight={850} color="green.750">
            {overallScore}
          </Text>
          <Text fontSize="9px" color="gray.400" fontWeight={600}>
            /100
          </Text>
        </HStack>
        <Text fontSize="11px" fontWeight={800} color="green.700">
          {overallLabel}
        </Text>
      </Flex>
    </Box>
  );
};
