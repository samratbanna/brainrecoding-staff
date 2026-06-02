import React from "react";
import { Box, Text, VStack, Flex, HStack, Center, Icon } from "@chakra-ui/react";
import { BsChevronRight, BsCheckCircleFill, BsClockFill, BsShieldCheck, BsBellFill, BsBarChartLine } from "react-icons/bs";

export interface StrengthRiskItem {
  title: string;
  desc: string;
  type: string;
  bg: string;
  border: string;
  iconColor: string;
  icon: React.ComponentType<any>;
}

interface StrengthsRisksCardProps {
  strengthsRisks?: StrengthRiskItem[];
  onItemClick?: (item: StrengthRiskItem) => void;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
}

const defaultStrengthsRisks: StrengthRiskItem[] = [
  {
    title: "High Discipline",
    desc: "Follow-up completion rate is 89% which is excellent.",
    type: "strength",
    bg: "#E8F5E9",
    border: "#C8E6C9",
    iconColor: "#2E7D32",
    icon: BsCheckCircleFill,
  },
  {
    title: "Slow First Response",
    desc: "Average response time is 3m 24s. Target is under 3m.",
    type: "risk",
    bg: "#FFF3E0",
    border: "#FFE0B2",
    iconColor: "#E65100",
    icon: BsClockFill,
  },
  {
    title: "Strong Demo Conversion",
    desc: "Demo → Conversion rate is 44.6% which is great.",
    type: "strength",
    bg: "#E8F5E9",
    border: "#C8E6C9",
    iconColor: "#2E7D32",
    icon: BsShieldCheck,
  },
  {
    title: "Overdue Follow-ups",
    desc: "68 follow-ups are overdue. Take immediate action.",
    type: "risk",
    bg: "#FFEBEE",
    border: "#FFCDD2",
    iconColor: "#C62828",
    icon: BsBellFill,
  },
];

export const StrengthsRisksCard: React.FC<StrengthsRisksCardProps> = ({
  strengthsRisks = defaultStrengthsRisks,
  onItemClick,
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
      <Text fontWeight={800} fontSize="sm" color={textPrimary} mb={4.5}>
        Strengths & Risks
      </Text>

      <VStack spacing={3} align="stretch">
        {strengthsRisks.length === 0 ? (
          <Center
            py={8}
            flexDirection="column"
            gap={3}
            mt={10}
            bg="gray.50"
            borderRadius="xl"
            border="1.5px dashed"
            borderColor="gray.200"
          >
            <Center
              w="52px"
              h="52px"
              bg="white"
              borderRadius="full"
              shadow="sm"
              border="1px solid"
              borderColor="gray.100"
            >
              <Icon as={BsBarChartLine} color="gray.300" boxSize={6} />
            </Center>
            <VStack spacing={0.5}>
              <Text fontSize="xs" fontWeight={800} color="gray.500">
                No Activity Yet
              </Text>
              <Text fontSize="9px" color="gray.400" fontWeight={600} textAlign="center" maxW="140px">
                Strengths & risks will appear once work data is recorded.
              </Text>
            </VStack>
          </Center>
        ) : (
          strengthsRisks.map((a) => (
            <Box
              key={a.title}
              border="1px solid"
              borderColor={a.border}
              bg={a.bg}
              borderRadius="xl"
              p={2.5}
              shadow="xs"
              transition="transform 0.15s"
              cursor="pointer"
              _hover={{ transform: "scale(1.01)" }}
              onClick={() => onItemClick && onItemClick(a)}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={3}>
                  <Center w="40px" h="40px" bg="white" borderRadius="full" shadow="xs" flexShrink={0}>
                    <Icon as={a.icon} color={a.iconColor} boxSize={6} />
                  </Center>
                  <Box overflow="hidden">
                    <Text fontSize="xs" fontWeight={850} color="gray.800">
                      {a.title}
                    </Text>
                    <Text fontSize="9px" color="gray.500" fontWeight={600} noOfLines={1}>
                      {a.desc}
                    </Text>
                  </Box>
                </HStack>
                <Icon as={BsChevronRight} color="gray.400" boxSize={3} ml={1} />
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};
