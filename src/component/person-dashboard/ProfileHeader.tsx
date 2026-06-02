import React from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  Badge,
  Icon,
  Select,
  Button,
  HStack,
  VStack,
  Avatar,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import {
  BsPeopleFill,
  BsChevronRight,
  BsCalendarDateFill,
  BsArrowUpRight,
  BsPersonFill,
  BsPersonCheckFill,
} from "react-icons/bs";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { Select as ChakraSelect } from "chakra-react-select";

const BRAND_GREEN = "#1B5E20";
const BRAND_GREEN_LIGHT = "#2E7D32";

export interface MemberInfo {
  name: string;
  role: string;
  avatarUrl: string;
  reportingTo: string;
  joinedOn: string;
  teamSize: number;
  status: string;
}

interface ProfileHeaderProps {
  memberInfo?: MemberInfo;
  score?: number;
  scoreLabel?: string;
  dateRangeLabel?: string;
  onExportReport?: () => void;
  onDateRangeClick?: () => void;
  onFilterChange?: (filterKey: string, value: string) => void;
  cardBg?: string;
  border?: string;
  textPrimary?: string;
  textSecondary?: string;

  // Custom interactive props
  staffList?: any[];
  selectedStaffId?: string;
  onStaffChange?: (selectedOption: any) => void;
  startDate?: string;
  endDate?: string;
  onDateChange?: (start: string, end: string) => void;
  showAllOption?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  memberInfo = {},
  score = 86,
  scoreLabel = "Excellent",
  dateRangeLabel = "May 05 - May 11, 2025",
  onExportReport,
  onDateRangeClick,
  onFilterChange,
  cardBg = "white",
  border = "gray.200",
  textPrimary = "gray.850",
  textSecondary = "gray.500",
  staffList = [],
  selectedStaffId = "",
  onStaffChange,
  startDate = "",
  endDate = "",
  onDateChange,
  showAllOption = false,
}) => {
  console.log("memberInfo", memberInfo);

  const {
    isOpen: isDateOpen,
    onOpen: onDateOpen,
    onClose: onDateClose,
  } = useDisclosure();
  const [tempStart, setTempStart] = React.useState(startDate);
  const [tempEnd, setTempEnd] = React.useState(endDate);

  const handleDateOpen = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    onDateOpen();
  };

  const handleDateApply = () => {
    onDateChange && onDateChange(tempStart, tempEnd);
    onDateClose();
  };

  const selectOptions = React.useMemo(() => {
    const staffOptions = staffList.map((staff: any) => ({
      label: `${staff.name} (${staff.role?.name || "Staff"})`,
      value: staff._id,
      role: staff.role,
    }));
    if (showAllOption) {
      return [{ label: "← All People", value: "__all__", role: null }, ...staffOptions];
    }
    return staffOptions;
  }, [staffList, showAllOption]);

  const selectedOption = React.useMemo(() => {
    return selectOptions.find((opt) => opt.value === selectedStaffId) || null;
  }, [selectOptions, selectedStaffId]);

  return (
    <>
      {/* Page Heading & Main Action */}
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        align={{ base: "start", sm: "center" }}
        gap={4}
        mb={5}
      >
        <Box>
          <Text
            fontSize="2xl"
            fontWeight={800}
            letterSpacing="-0.5px"
            color={textPrimary}
          >
            Person X-Ray Dashboard
          </Text>
          <Text fontSize="xs" color={textSecondary} fontWeight={600}>
            Deep performance view of one team member with activity, discipline,
            demo and conversion intelligence.
          </Text>
        </Box>
        <Button
          leftIcon={<FiDownload />}
          bg={BRAND_GREEN}
          color="white"
          _hover={{ bg: BRAND_GREEN_LIGHT }}
          _active={{ bg: BRAND_GREEN }}
          size="sm"
          borderRadius="lg"
          px={5}
          py={5}
          fontSize="xs"
          fontWeight={700}
          shadow="sm"
          onClick={onExportReport}
        >
          Export Report
        </Button>
      </Flex>

      {/* Profile & Filter Panel */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1.1fr 1.6fr 0.3fr" }}
        gap={4}
        bg={cardBg}
        p={4}
        borderRadius="xl"
        border="1px solid"
        borderColor={border}
        mb={5}
        shadow="xs"
        alignItems="center"
      >
        {/* Left Section: Avatar & Info */}
        <Flex align="center" gap={4}>
          <Avatar
            w="65px"
            h="65px"
            src={memberInfo.avatarUrl || "https://bit.ly/prosper-baba"}
            name={memberInfo.name}
            border="2px solid"
            borderColor="green.400"
          />
          <Box>
            <HStack spacing={2} align="center" mb={1.5}>
              <Text fontSize="lg" fontWeight={800} color="gray.850">
                {memberInfo.name}
              </Text>
              <Text fontSize="xs" color="gray.400" fontWeight={600}>
                —
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight={750}>
                {memberInfo.role}
              </Text>
              <Badge
                colorScheme="green"
                variant="subtle"
                fontSize="9px"
                px={2}
                borderRadius="full"
              >
                {memberInfo.status || "Active"}
              </Badge>
            </HStack>
            <HStack spacing={4} flexWrap="wrap" gap={2}>
              {memberInfo?.reportingTo ? (
                <HStack spacing={1} color="gray.500">
                  <Icon as={BsArrowUpRight} boxSize={3} />
                  <Text fontSize="10px" fontWeight={650}>
                    Reporting To:{" "}
                    <Text as="span" fontWeight={800}>
                      {memberInfo.reportingTo}
                    </Text>
                  </Text>
                </HStack>
              ) : null}
              {/* <HStack spacing={1} color="gray.500">
                <Icon as={FiCalendar} boxSize={3} />
                <Text fontSize="10px" fontWeight={650}>
                  Joined On:{" "}
                  <Text as="span" fontWeight={850}>
                    {memberInfo.joinedOn}
                  </Text>
                </Text>
              </HStack>
              <HStack spacing={1} color="gray.500">
                <Icon as={BsPeopleFill} boxSize={3} />
                <Text fontSize="10px" fontWeight={650}>
                  Team Size:{" "}
                  <Text as="span" fontWeight={850}>
                    {memberInfo.teamSize} Members
                  </Text>
                </Text>
              </HStack> */}
            </HStack>
          </Box>
        </Flex>

        {/* Middle Section: Filters */}
        <Flex
          gap={3}
          flexWrap="wrap"
          justify={{ base: "start", lg: "end" }}
          align="center"
        >
          {/* Staff Switcher */}
          {staffList.length > 0 && (
            <Box minW="190px" maxW="280px" flex={1}>
              <ChakraSelect
                placeholder="Switch Staff..."
                size="sm"
                options={selectOptions}
                value={selectedOption}
                isSearchable
                onChange={onStaffChange}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    height: "38px",
                    borderRadius: "lg",
                    fontSize: "11px",
                    fontWeight: "750",
                    borderColor: "gray.200",
                    backgroundColor: "white",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
            </Box>
          )}

          {/* Interactive Date Range Popover */}
          <Popover
            isOpen={isDateOpen}
            onClose={onDateClose}
            placement="bottom-start"
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <HStack
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                px={3}
                py={1.5}
                minW="180px"
                height="38px"
                spacing={2}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={handleDateOpen}
              >
                <Icon as={BsCalendarDateFill} color="gray.400" boxSize={3.5} />
                <VStack align="start" spacing={0} flex={1}>
                  <Text
                    fontSize="8px"
                    color="gray.400"
                    fontWeight={700}
                    transform="translateY(2px)"
                  >
                    Date Range
                  </Text>
                  <Text fontSize="10px" fontWeight={800} color="gray.700">
                    {startDate && endDate
                      ? `${startDate} to ${endDate}`
                      : dateRangeLabel}
                  </Text>
                </VStack>
                <Icon
                  as={BsChevronRight}
                  color="gray.400"
                  boxSize={3}
                  transform="rotate(90deg)"
                />
              </HStack>
            </PopoverTrigger>
            <PopoverContent
              p={4}
              borderRadius="xl"
              shadow="lg"
              border="1px solid"
              borderColor="gray.150"
              w="260px"
              zIndex={9999}
            >
              <PopoverArrow />
              <PopoverHeader
                fontWeight={800}
                fontSize="sm"
                border="none"
                pb={2}
                color="gray.700"
              >
                Select Date Range
              </PopoverHeader>
              <PopoverBody>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel
                      fontSize="10px"
                      fontWeight={700}
                      color="gray.500"
                      mb={1}
                    >
                      Start Date
                    </FormLabel>
                    <Input
                      type="date"
                      size="sm"
                      borderRadius="md"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                      max={tempEnd}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="10px"
                      fontWeight={700}
                      color="gray.500"
                      mb={1}
                    >
                      End Date
                    </FormLabel>
                    <Input
                      type="date"
                      size="sm"
                      borderRadius="md"
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                      min={tempStart}
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    bg={BRAND_GREEN}
                    color="white"
                    _hover={{ bg: BRAND_GREEN_LIGHT }}
                    borderRadius="md"
                    fontWeight={700}
                    fontSize="xs"
                    onClick={handleDateApply}
                    w="full"
                  >
                    Apply
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* {[
            { key: "viewBy", placeholder: "View By", opt: "Daily" },
            { key: "source", placeholder: "Source", opt: "All Sources" },
            { key: "status", placeholder: "Status", opt: "All Statuses" },
          ].map((f) => (
            <Box key={f.key} minW="105px">
              <Select
                size="sm"
                borderRadius="lg"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                fontSize="10px"
                fontWeight={750}
                color="gray.700"
                height="38px"
                placeholder={f.placeholder}
                defaultValue="all"
                icon={<BsChevronRight style={{ transform: "rotate(90deg)" }} />}
                onChange={(e) => onFilterChange && onFilterChange(f.key, e.target.value)}
              >
                <option value="all">{f.opt}</option>
              </Select>
            </Box>
          ))} */}
        </Flex>

        {/* Right Section: Circular Score Gauge */}
        <Flex justify={{ base: "start", lg: "end" }} align="center">
          <VStack spacing={0.5} align="center">
            <Box position="relative" w="54px" h="54px">
              <Center
                w="full"
                h="full"
                bg="green.50"
                borderRadius="full"
                border="4px solid"
                borderColor="green.500"
              >
                <VStack spacing={0}>
                  <Text
                    fontSize="sm"
                    fontWeight={900}
                    color="green.750"
                    lineHeight={1.1}
                  >
                    {score}
                  </Text>
                  <Text
                    fontSize="7px"
                    color="gray.400"
                    fontWeight={600}
                    mt={-0.5}
                  >
                    /100
                  </Text>
                </VStack>
              </Center>
            </Box>
            <Text
              fontSize="9px"
              fontWeight={850}
              color="green.600"
              textTransform="uppercase"
            >
              {scoreLabel}
            </Text>
          </VStack>
        </Flex>
      </Grid>
    </>
  );
};
