import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tooltip,
  useDisclosure,
  Switch,
  CloseButton,
} from "@chakra-ui/react";
import { LeadDrawer } from "./LeadDrawer";
import { TimelineModal } from "./TimeLineModal";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useLeadStore } from "../../store/lead";
import { filter, find, map, orderBy, size } from "lodash";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MdOutlineRefresh } from "react-icons/md";
import { LoadingContainer } from "../../common/LoadingContainer";
import { EmptyBox } from "../../common/EmptyBox";
import { LEADSTATUS, ONLY_MY_LEADS, STATUS } from "../../constant";
import { Pagination } from "../../common/Pagination";
import { PageLimit } from "../../common/PageLimit";
import { Controller, useForm } from "react-hook-form";
import { FollowUpAndMeetingModal } from "../lead/FollowUpAndMeetingModal";
import { useStateStore } from "@/store/states";
import { useLoginStore } from "@/store/login";
import { PayAmountModal } from "./PayAmountModal";
import UseStatusCheck from "../../libs/UseStatusCheck";
import { useMeetingStore } from "@/store/meeting";
import { MeetingModal } from "./MeetingModal";
import { MeetingListModal } from "./MeetingListModal";
import { threeDotsCss } from "@/theme";
import { getDateRanges } from "@/utils/Helper";
import { LeadColloboratorModal } from "./collebratorModal";
import { CallLogModal } from "./CallLogModal";
import { CallLogListModal } from "./CallListModal";
import { DemoListModal } from "./DemoListModal";
import { DemoModal } from "./DemoModal";
import {AssignCollaboratorModal} from "./AssignColloboratorModal";

const columnHelper = createColumnHelper();

export const callLogStatus = {
  ANSWERED: "Answered",
  INVALID_NUMBER: "Invalid Number",
  NO_ANSWER: "No Answer",
  BUSY: "Busy",
};

const callLogStatusColors2= {
  ANSWERED: "green.100",
  INVALID_NUMBER: "yellow.100",
  NO_ANSWER: "red.100",
  BUSY: "orange.100",
};
export const callLogStatusColors = {
  ANSWERED: "green", // success
  INVALID_NUMBER: "purple", // neutral / invalid
  NO_ANSWER: "yellow", // warning
  BUSY: "red", // error / busy
};


export const LeadsList = ({ payload }) => {
  const [leadsId, setLeadsId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [leadStatus, setLeadStatus] = useState();
  const [leadType, setLeadType] = useState("");
  const [staffId, setStaffId] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  
  const { handleSubmit, control, getValues, setValue, watch, onChange } = useForm();

  const range = watch('rangeDate');

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPayModal,
    onOpen: onOpenPayModal,
    onClose: onClosePayModal,
  } = useDisclosure();

  const { userData } = useLoginStore((s) => ({ userData: s.userData }));

  const {
    isOpen: isOpenFollowUpModal,
    onOpen: onOpenFollowUpModal,
    onClose: onCloseFollowUpModal,
  } = useDisclosure();

  const {
    isOpen: isMeetingListModal,
    onOpen: onOpenMeetingListModal,
    onClose: onCloseMeetingListModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMeetingModal,
    onClose: onCloseMeetingModal,
    onOpen: onOpenMeetingModal,
  } = useDisclosure();

  // Add collaborator modal
  const {
    isOpen: isAssignColloboratorModal,
    onOpen: onOpenAssignColloboratorModal,
    onClose: onCloseAssignColloboratorModal,
  } = useDisclosure();

  // Add add collaborator modal
  const {
    isOpen: isColloboratorModal,
    onOpen: onOpenColloboratorModal,
    onClose: onCloseColloboratorModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDemoModal,
    onClose: onCloseDemoModal,
    onOpen: onOpenDemoModal,
  } = useDisclosure();

  const {
    isOpen: isOpenCallLogModal,
    onOpen: onOpenCallLogModal,
    onClose: onCloseCallLogModal,
  } = useDisclosure();

  const {
    isOpen: isCallModalOpen,
    onOpen: onOpenCallModal,
    onClose: onCloseCallModal,
  } = useDisclosure();

  const {
    isOpen: isDemoListModal,
    onOpen: onOpenDemoListModal,
    onClose: onCloseDemoListModal,
  } = useDisclosure();

  const {
    getLeadsAction,
    getLeadsStatus,
    leadsDetails,
    getMeetingLeadAction,
    getMeetingLeadStatus,
    getfollowUpLeadStatus,
    getfollowUpLeadAction,
    updateLeadsAction,
    updateLeadsStatus,
    resetStatus,
  } = useLeadStore((s) => ({
    getLeadsAction: s.getLeadsAction,
    getLeadsStatus: s.getLeadsStatus,
    leadsDetails: s.leadsDetails,
    getMeetingLeadAction: s.getMeetingLeadAction,
    getfollowUpLeadAction: s.getfollowUpLeadAction,
    getMeetingLeadStatus: s.getMeetingLeadStatus,
    getfollowUpLeadStatus: s.getfollowUpLeadStatus,
    updateLeadsAction: s.updateLeadsAction,
    updateLeadsStatus: s.updateLeadsStatus,
    resetStatus: s.resetStatus,
  }));

  const { addCallLogAction, addCallLogStatus } = useLeadStore((s) => ({
    addCallLogAction: s.addCallLogAction,
    addCallLogStatus: s.addCallLogStatus,
    resetStatus: s.resetStatus,
  }));

  UseStatusCheck({
    status: addCallLogStatus,
    onSuccess: () => {
      _getLeads({
        page: currentPage,
        limit: pageLimit,
      });
    },
    onError: () => {
      // ErrorAlert("Error while fees deopsit")
    },
  });

  const { getStateAction, states } = useStateStore((s) => ({
    getStateAction: s.getStateAction,
    states: s.states,
  }));

  const addMeetingStatus = useMeetingStore((s) => s.addMeetingStatus);
  const addLeadFollowUpStatus = useLeadStore((s) => s.addLeadFollowUpStatus);

  // Handle row selection
  const handleSelectRow = (lead) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(lead?._id)
        ? prevSelectedRows.filter((rowId) => rowId !== lead?._id)
        : [...prevSelectedRows, lead?._id]
    );
    setSelectedLeads((prevSelectedRows) =>
      prevSelectedRows.find((l) => l?._id === lead?._id)
        ? prevSelectedRows.filter((rowId) => rowId?._id !== lead?._id)
        : [...prevSelectedRows, lead]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === table.getRowModel().rows.length) {
      setSelectedRows([]);
      setSelectedLeads([]);
    } else {
      const allRowIds = table.getRowModel().rows.map((row) => row.original._id);
      setSelectedRows(allRowIds);
      setSelectedLeads(map(table.getRowModel().rows, (r) => r.original));
    }
  };

  // Handle assign collaborator
  const handleAssignCollaborator = () => {
    onOpenAssignColloboratorModal();
  };

  UseStatusCheck({
    status: addMeetingStatus,
    onSuccess: () => {
      const params = {
        page: currentPage,
        limit: pageLimit,
        ...getValues(),
        ...payload,
      };
      if (isTeleCaller) {
        params["telecallerId"] = userData?._id;
        _getLeads(params);
      } else {
        params["staffId"] = userData?._id;
        _getLeads(params);
      }
    },
    onError: () => {
      // ErrorAlert("Error while fees deopsit")
    },
  });

  UseStatusCheck({
    status: addLeadFollowUpStatus,
    onSuccess: () => {
      const params = {
        page: currentPage,
        limit: pageLimit,
        ...getValues(),
        ...payload,
      };
      if (isTeleCaller) {
        params["telecallerId"] = userData?._id;
        _getLeads(params);
      } else {
        params["staffId"] = userData?._id;
        _getLeads(params);
      }
    },
    onError: () => {
      // ErrorAlert("Error while fees deopsit")
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("ownerName", {
        cell: info => {
          return (
            <Box>
              <Text {...threeDotsCss} fontWeight="semibold">
                {info.row.original?.ownerName}
              </Text>
              <Text>{info.row.original.email}</Text>
              <Text>{info.row.original.contact}</Text>
              {info.row.original?.leadSource ? (
                <Tag size="sm" colorScheme="defaultColor" mt={1}>
                  <TagLabel>{info.row.original.leadSource}</TagLabel>
                </Tag>
              ) : null}
            </Box>
          );
        },
        header: () => "Lead Name",
        footer: (info) => info.column.id,
      }),
      // columnHelper.accessor("stateId", {
      //   cell: info => {
      //     return (
      //       <Tooltip label={info.row.original?.staffId?.name}>
      //         <Text {...threeDotsCss}>{info.row.original?.staffId?.name}</Text>
      //       </Tooltip>
      //     )
      //   },
      //   header: () => "Refer By",
      //   footer: (info) => info.column.id,
      // }),
      // columnHelper.accessor("stateManagerId", {
      //   cell: info => {
      //     return (
      //       <Tooltip label={info.row.original?.stateManagerId?.name}>
      //         <Text {...threeDotsCss}>{info.row.original?.stateManagerId?.name}</Text>
      //       </Tooltip>
      //     )
      //   },
      //   header: () => "Growth Manager",
      //   footer: (info) => info.column.id,
      // }),
      // columnHelper.accessor("districtManagerId", {
      //   cell: info => {
      //     return (
      //       <Tooltip label={info.row.original?.districtManagerId?.name}>
      //         <Text {...threeDotsCss}>{info.row.original?.districtManagerId?.name}</Text>
      //       </Tooltip>
      //     )
      //   },
      //   header: () => "Team Leader",
      //   footer: (info) => info.column.id,
      // }),
    ],
    []
  );

  const table = useReactTable(
    useMemo(
      () => ({
        data: orderBy(leadsDetails?.docs, "createdAt", "desc") || [],
        columns,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
      }),
      [columns, leadsDetails]
    )
  );

  const handleLeadsDrawer = (id = null) => {
    onOpenDrawer();
    setLeadsId(id);
  };

  const handleTimelineModal = (id = null, status) => {
    onOpenModal();
    setLeadStatus(status);
    setLeadsId(id);
  };

  const handleFollowUpModal = (id = null) => {
    onOpenFollowUpModal();
    setLeadsId(id);
  };

  const handleMeetingModal = (id) => {
    onOpenMeetingModal();
    setLeadsId(id);
  };

  const handleMeetingListModal = (id = null) => {
    onOpenMeetingListModal();
    setLeadsId(id);
  };

  const handleCallLogListModal = (id = null) => {
    onOpenCallLogModal();
    setLeadsId(id);
  };

  const handleCallLogModal = (id = null, status) => {
    onOpenCallModal();
    setLeadStatus(status);
    setLeadsId(id);
  };

  const handleDemoListModal = (id = null) => {
    onOpenDemoListModal();
    setLeadsId(id);
  };

  const _getLeads = useCallback(
    (data) => {
      if (payload?.isMeetingLead) {
        if (payload.allLeads) {
          let params = {
            ...data,
            isPopulate: true,
            status: "MEETING_SCHEDULED"
          }
          getLeadsAction(params);
        } else {
          getMeetingLeadAction({ ...data });
        }
      } else if (payload?.isFollowUpLead) {
        if (payload.allLeads) {
          let params = {
            ...data,
            isPopulate: true,
            followUp: true
          }
          getLeadsAction(params);
        } else {
          getfollowUpLeadAction({ ...data });
        }
      } else {
        let params = { ...data, isPopulate: true }
        getLeadsAction(params);
      }
    },
    [getLeadsAction, getMeetingLeadAction, getfollowUpLeadAction, payload]
  );

  const isTeleCaller = useMemo(
    () => (userData && userData.role === "CALLER" ? true : false),
    [userData]
  );
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageLimit,
      ...getValues(),
      ...payload,
    };
    if (isTeleCaller) {
      params["telecallerId"] = userData?._id;
      _getLeads(params);
    } else {
      params["staffId"] = userData?._id;
      _getLeads(params);
    }
  }, [currentPage, pageLimit, getValues, _getLeads, userData, isTeleCaller, payload]);

  const onApply = () => {
    const filteredObj = Object.fromEntries(
      Object.entries(getValues()).filter(([key]) => key !== 'myLeads' || key !== 'rangeDate')
    );
    let data = { ...filteredObj };
    const rangeDate = getValues().rangeDate;
    console.log("rangeDate", rangeDate);

    if (getValues().myLeads === 'ONLY_MY_LEADS') {
      data = { ...data, myLeads: true }
    }
    if (rangeDate && rangeDate !== "ALL" && rangeDate !== "CUSTOM") {
      const [startDate, endDate] = rangeDate.split('|');
      data = { ...data, startDate, endDate }
    }
    getLeadsAction({
      limit: pageLimit,
      staffId: userData?._id,
      ...data,
      isPopulate: true,
    });
    setCurrentPage(1);
  };

  const _resetField = () => {
    getLeadsAction({
      limit: pageLimit,
      staffId: userData?._id,
      isPopulate: true,
    });
    setValue("ownerName", "");
    setValue("contact", "");
    setValue("stateName", "");
    setValue("district", "");
    setCurrentPage(1);
  };

  const { totalPages } = leadsDetails || {};

  useEffect(() => {
    getStateAction();
  }, [getStateAction]);

  const [teamLeader, setTeamLeader] = useState([]);
  const [trainers, setTrainers] = useState();

  const selectedState = watch("stateName");
  const teamLeaderId = watch('districtManagerId');
  const trainerId = watch('trainerId');
  const { getTeam, teamStatus, teamList, getTeamDashboard, teamReportStatus, teamDashboard } = useLeadStore();
  
  useEffect(() => {
    getTeam();
  }, [])
  
  useEffect(() => {
    if (userData?.role === 'GROWTH_PARTNER') {
      const teamLeadList = filter(
        teamList,
        (staff) => staff.stateManagerId === userData?._id && staff?.role === 'TEAM_LEADER'
      );
      setTeamLeader(teamLeadList);
    } else if (userData?.role === 'TEAM_LEADER') {
      const teamLeadList = filter(
        teamList,
        (staff) => staff.districtManagerId === userData?._id && staff?.role === 'TRAINER'
      );
      setTrainers(teamLeadList);
    }
  }, [userData, teamList]);

  useEffect(() => {
    if (teamLeaderId) {
      const trainerList = filter(
        teamList,
        (staff) => staff.districtManagerId === teamLeaderId
      );
      setTrainers(trainerList);
    }
  }, [teamLeaderId]);

  const districtData = useMemo(
    () => find(states, (state) => state.name == selectedState),
    [selectedState, states]
  );

  const handleViewCollaborator = (id = null) => {
    onOpenColloboratorModal();
    setLeadsId(id);
  };

  const handleStatus = (status, leadId, data) => {
    if (status !== "CONVERTED") {
      updateLeadsAction({
        id: leadId,
        status,
      });
    }
     if (status === "DEMO_SCHEDULED") {
       onOpenDemoModal();
     }
    if (status === "CONVERTED") {
      onOpenPayModal();
      setLeadType(data.leadType);
      setLeadsId(leadId);
      setStaffId(data.staffId);
    }
  };

  useEffect(() => {
    if (updateLeadsStatus === STATUS.SUCCESS) {
      resetStatus();
    }
  }, [updateLeadsStatus, resetStatus]);

  return (
    <Box p={4} bg="white">
      <Flex justify="space-between" align="end" w="100%" my={3}>
        <Box w="70%">
          <form onSubmit={handleSubmit(onApply)}>
            <HStack flexWrap={"wrap"}>
              <Controller
                control={control}
                name="ownerName"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Search by Name"
                    size="sm"
                    w="200px"
                  />
                )}
              />
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Search by Contact"
                    type="number"
                    size="sm"
                    w="200px"
                  />
                )}
              />
              {userData?.role === "GROWTH_PARTNER" ? (
                <Controller
                  name="districtManagerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select Team Leader"
                      size="sm"
                      w="200px"
                    >
                      {map(teamLeader, (staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              ) : null}
              <Controller
                name="trainerId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Trainer"
                    size="sm"
                    w="200px"
                  >
                    {map(trainers, (staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Status"
                    size="sm"
                    w="200px"
                  >
                    {map(LEADSTATUS, (city) => (
                      <option key={city.id} value={city.id}>
                        {city.title}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="myLeads"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Leads"
                    size="sm"
                    w="200px"
                  >
                    {map(ONLY_MY_LEADS, (city) => (
                      <option key={city.id} value={city.id}>
                        {city.title}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="rangeDate"
                render={({ field }) => (
                  <Select w="200px" size="sm" {...field}>
                    <option value={"ALL"}>All Leads</option>
                    <option value={getDateRanges().todayRange}>Today</option>
                    <option value={getDateRanges().yesterdayRange}>
                      Yesterday
                    </option>
                    <option value={getDateRanges().thisWeekRange}>
                      This Week
                    </option>
                    <option value={getDateRanges().thisMonthRange}>
                      This Month
                    </option>
                    <option value={getDateRanges().lastMonthRange}>
                      Last Month
                    </option>
                    <option value={"CUSTOM"}>Select Date Range</option>
                  </Select>
                )}
              />
              {range === "CUSTOM" ? (
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Input {...field} size="sm" type="date" w="150px" />
                  )}
                />
              ) : null}
              {range === "CUSTOM" ? (
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Input {...field} size="sm" type="date" w="150px" />
                  )}
                />
              ) : null}
              <HStack>
                <Button
                  size="sm"
                  type="submit"
                  colorScheme="defaultColor"
                  color="white"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<MdOutlineRefresh fontSize="18px" />}
                  onClick={_resetField}
                >
                  Reset
                </Button>
              </HStack>
            </HStack>
          </form>
        </Box>
        <PageLimit
          pageLimit={pageLimit}
          setPageLimit={setPageLimit}
          setCurrentPage={setCurrentPage}
        />
      </Flex>

      {/* Selected rows actions */}
      {size(selectedRows) > 0 ? (
        <Flex align="center" w="100%" my={3}>
          <CloseButton
            onClick={() => {
              setSelectedRows([]);
              setSelectedLeads([]);
            }}
            fontSize={14}
            color={"red"}
            mr={1}
          />
          <Text>{`${size(selectedRows)} Leads Selected`}</Text>
          <Button
            size="sm"
            colorScheme="blue"
            ml={5}
            onClick={handleAssignCollaborator}
          >
            Assign Collaborator
          </Button>
        </Flex>
      ) : null}

      <LoadingContainer
        loading={
          getLeadsStatus === STATUS.FETCHING ||
          getfollowUpLeadStatus === STATUS.FETCHING ||
          getMeetingLeadStatus === STATUS.FETCHING
        }
      >
        <TableContainer
          // pt={5}
          borderRadius="10px"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Box overflowX="auto">
            <Table variant="simple" colorScheme="gray" size="sm">
              <Thead bg="gray.100">
                {table?.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    <Th border="1px solid" borderColor="gray.200" py={5}>
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length ===
                          table.getRowModel().rows.length
                        }
                        onChange={handleSelectAll}
                      />
                    </Th>
                    {map(headerGroup.headers, (header) => (
                      <Th
                        key={header.id}
                        border="1px solid"
                        borderColor="gray.200"
                        fontSize="sm"
                        whiteSpace="nowrap"
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </Th>
                    ))}
                    {/* <Th border="1px solid" borderColor="gray.200">
                      TeleCaller
                    </Th> */}
                    <Th border="1px solid" borderColor="gray.200">
                      Staff
                    </Th>
                    <Th border="1px solid" borderColor="gray.200">
                      Call Status
                    </Th>
                    <Th border="1px solid" borderColor="gray.200">
                      Lead Status
                    </Th>
                    <Th border="1px solid" borderColor="gray.200">
                      Actions
                    </Th>
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    const status = find(
                      leadsDetails.docs,
                      (lead) => lead._id === row.original._id
                    );

                    return (
                      <Tr key={row.original?._id} _hover={{ bg: "gray.50" }}>
                        <Td border="1px solid" borderColor="gray.200">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.original._id)}
                            onChange={() => handleSelectRow(row.original)}
                          />
                        </Td>

                        {row.getVisibleCells().map((cell) => (
                          <Td
                            key={cell.id}
                            border="1px solid"
                            borderColor="gray.200"
                            whiteSpace="nowrap"
                            maxW="180px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize="sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        ))}
                        <Td
                          border="1px solid"
                          borderColor="gray.200"
                          whiteSpace="nowrap"
                          maxW="180px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          fontSize="sm"
                        >
                          <Box flexDirection={"column"}>
                            <Text>{`${
                              row.original?.staffId?.name || ""
                            }`}</Text>
                            {row.original?.stateManagerId ? (
                              <Text>{`${row.original?.stateManagerId?.name}`}</Text>
                            ) : (
                              ""
                            )}
                            {row.original?.districtManagerId ? (
                              <Text>{`${row.original?.districtManagerId?.name}`}</Text>
                            ) : (
                              ""
                            )}
                          </Box>
                        </Td>
                        <Td
                          border="1px solid"
                          borderColor="gray.200"
                          whiteSpace="nowrap"
                          maxW="180px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          fontSize="sm"
                          bg={callLogStatusColors2[row?.original?.callLog?.callStatus] || "white"}
                        >
                          {callLogStatus[row?.original?.callLog?.callStatus]}
                        </Td>


                        {/* <Td border="1px solid" borderColor="gray.200">
                          {status.telecallerId ? (
                            <Flex gap={2} align="center">
                              <Text fontSize="sm">
                                {status.telecallerId?.name}
                              </Text>
                              <Tooltip label="Edit TeleCaller" hasArrow>
                                <Icon
                                  cursor="pointer"
                                  as={EditIcon}
                                  onClick={() =>
                                    handleTelecallerModal(
                                      row.original?._id,
                                      row.original?.telecallerId
                                    )
                                  }
                                />
                              </Tooltip>
                            </Flex>
                          ) : status.status !== "CONVERTED" ? (
                            <Box
                              cursor="pointer"
                              color="orange.600"
                              onClick={() =>
                                handleTelecallerModal(row.original?._id)
                              }
                            >
                              Assign TeleCaller
                            </Box>
                          ) : (
                            <Text fontSize="sm">Lead Converted</Text>
                          )}
                        </Td> */}

                        <Td border="1px solid" borderColor="gray.200">
                          {status.status === "CONVERTED" ? (
                            <Text fontSize="sm">{status.status}</Text>
                          ) : (
                            <Select
                              placeholder="Select Current Status"
                              size="sm"
                              value={status?.status}
                              onChange={(e) =>
                                handleStatus(
                                  e.target.value,
                                  row.original?._id,
                                  status
                                )
                              }
                              fontSize="sm"
                            >
                              {map(LEADSTATUS, (status) => (
                                <option key={status.id} value={status.id}>
                                  {status.title}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Td>

                        <Td border="1px solid" borderColor="gray.200">
                          <HStack spacing={2} wrap="wrap" fontSize="sm">
                            <Box
                              color="blue.500"
                              cursor="pointer"
                              onClick={() =>
                                handleLeadsDrawer(row.original?._id)
                              }
                            >
                              View
                            </Box>
                            <Box
                              color="red.500"
                              cursor="pointer"
                              onClick={() =>
                                toggleDeleteAlert(row.original?._id)
                              }
                            >
                              Delete
                            </Box>
                            <Box
                              color="green.500"
                              cursor="pointer"
                              onClick={() => handleLeadModal(row.original?._id)}
                            >
                              Edit
                            </Box>
                            {status.status !== "CONVERTED" && (
                              <Box
                                color="green.500"
                                cursor="pointer"
                                onClick={() => {
                                  if (status.status === "MEETING_SCHEDULED") {
                                    handleMeetingModal(
                                      row.original?._id,
                                      status
                                    );
                                  } else {
                                    handleTimelineModal(
                                      row.original?._id,
                                      status
                                    );
                                  }
                                }}
                              >
                                {status.status === "MEETING_SCHEDULED"
                                  ? "Add Meeting"
                                  : "Add Followups"}
                              </Box>
                            )}
                            <Box
                              color="red.400"
                              cursor="pointer"
                              onClick={() =>
                                handleFollowUpModal(row.original?._id)
                              }
                            >
                              Followups
                            </Box>
                            <Box
                              color="green.400"
                              cursor="pointer"
                              onClick={() =>
                                handleMeetingListModal(row.original?._id)
                              }
                            >
                              View Meetings
                            </Box>

                            <Box
                              color="blue.500"
                              cursor="pointer"
                              onClick={() =>
                                handleViewCollaborator(row.original?._id)
                              }
                            >
                              View Collaborators
                            </Box>
                            <Box
                              color="green.600"
                              cursor="pointer"
                              onClick={() =>
                                handleDemoListModal(row.original?._id)
                              }
                            >
                              View Demo
                            </Box>
                            <Box
                              color="blue.500"
                              cursor="pointer"
                              onClick={() =>
                                handleCallLogListModal(row.original?._id)
                              }
                            >
                              View Call Log
                            </Box>
                            <Box
                              color="green.500"
                              cursor="pointer"
                              onClick={() =>
                                handleCallLogModal(row.original?._id, status)
                              }
                            >
                              Add Call Log
                            </Box>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={10}>
                      <EmptyBox title="Leads not found" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
      </LoadingContainer>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      {isOpenDrawer && (
        <LeadDrawer
          isOpen={isOpenDrawer}
          onClose={onCloseDrawer}
          leadsId={leadsId}
        />
      )}
      {isOpenModal && (
        <TimelineModal
          isOpen={isOpenModal}
          onClose={onCloseModal}
          leadId={leadsId}
          status={leadStatus.status}
        />
      )}
      {isOpenFollowUpModal && (
        <FollowUpAndMeetingModal
          isOpen={isOpenFollowUpModal}
          onClose={onCloseFollowUpModal}
          leadId={leadsId}
        />
      )}
      {isOpenPayModal && (
        <PayAmountModal
          isOpen={isOpenPayModal}
          onClose={onClosePayModal}
          leadId={leadsId}
          leadType={leadType}
          staffId={staffId}
        />
      )}

      {isOpenMeetingModal && (
        <MeetingModal
          isOpen={isOpenMeetingModal}
          onClose={onCloseMeetingModal}
          leadId={leadsId}
        />
      )}

      {isMeetingListModal && (
        <MeetingListModal
          isOpen={isMeetingListModal}
          onClose={onCloseMeetingListModal}
          leadId={leadsId}
        />
      )}

      {/* Collaborator Assignment Modal */}
      {/* {isColloboratorModal && (
        <AssignCollaboratorModal
          isOpen={isColloboratorModal}
          onClose={onCloseColloboratorModal}
          leads={selectedLeads}
        />
      )} */}

      {isColloboratorModal && (
        <LeadColloboratorModal
          isOpen={isColloboratorModal}
          onClose={onCloseColloboratorModal}
          leadId={leadsId}
        />
      )}

      {isCallModalOpen && (
        <CallLogModal
          isOpen={isCallModalOpen}
          onClose={onCloseCallModal}
          leadId={leadsId}
          status={leadStatus.status}
        />
      )}

      {isDemoListModal && (
        <DemoListModal
          isOpen={isDemoListModal}
          onClose={onCloseDemoListModal}
          leadId={leadsId}
        />
      )}

      {isOpenCallLogModal && (
        <CallLogListModal
          isOpen={isOpenCallLogModal}
          onClose={onCloseCallLogModal}
          leadId={leadsId}
        />
      )}

      {isOpenDemoModal && (
        <DemoModal
          isOpen={isOpenDemoModal}
          onClose={onCloseDemoModal}
          leadId={leadsId}
        />
      )}

      {isAssignColloboratorModal && (
        <AssignCollaboratorModal
          isOpen={onOpenAssignColloboratorModal}
          onClose={onCloseAssignColloboratorModal}
          leadIds={selectedRows}
        />
      )}
    </Box>
  );
};

export const LeadTable = () => {
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));
  const isTeleCaller = useMemo(
    () => (userData && userData.role === "CALLER" ? true : false),
    [userData]
  );
  const LEADTABS = ["All", "Bucket", "Follow-ups", "Meetings", "Conversions"];

  return (
    <Tabs size="md" variant="enclosed" isLazy>
      <TabList>
        {map(LEADTABS, (tab, index) => (
          <Tab key={index}>{tab}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <LeadsTab />
        </TabPanel>
        <TabPanel>
          <LeadsTab payload={{ isBucket: true }} />
        </TabPanel>
        <TabPanel>
          <LeadsTab isShowTab={true} payload={{ isFollowUpLead: true }} />
        </TabPanel>
        <TabPanel>
          <LeadsTab isShowTab={true} payload={{ isMeetingLead: true }} />
        </TabPanel>
        <TabPanel>
          <LeadsTab payload={{ isConverted: true }} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const LeadsTab = ({ isShowTab, payload }) => {
  const tabCss = {
    border: "1px solid",
    borderColor: "gray.100",
  };
  return (
    <Box>
      {isShowTab ? (
        <Tabs
          size="sm"
          variant="soft-rounded"
          colorScheme="green"
          isFitted
          defaultIndex={0}
          isLazy
        >
          <TabList>
            <Tab _selected={{ color: "white", bg: "blue.200" }} {...tabCss}>
              All
            </Tab>
            <Tab _selected={{ color: "white", bg: "red.200" }} {...tabCss}>
              Missed
            </Tab>
            <Tab _selected={{ color: "white", bg: "green.200" }} {...tabCss}>
              Today
            </Tab>
            <Tab _selected={{ color: "white", bg: "blue.200" }} {...tabCss}>
              Upcoming
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LeadsList payload={{ ...payload, allLeads: true }} />
            </TabPanel>
            <TabPanel>
              <LeadsList payload={{ ...payload, passed: true }} />
            </TabPanel>
            <TabPanel>
              <LeadsList payload={{ ...payload, today: true }} />
            </TabPanel>
            <TabPanel>
              <LeadsList payload={{ ...payload, upcoming: true }} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <LeadsList payload={payload} />
      )}
    </Box>
  );
};
// import {
//   Box,
//   Button,
//   Flex,
//   HStack,
//   Input,
//   Select,
//   Tab,
//   TabList,
//   TabPanel,
//   TabPanels,
//   Table,
//   TableContainer,
//   Tabs,
//   Tag,
//   TagLabel,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   Tooltip,
//   useDisclosure,
//   Switch,
//   CloseButton,
// } from "@chakra-ui/react";
// import { LeadDrawer } from "./LeadDrawer";
// import { TimelineModal } from "./TimeLineModal";
// import { use, useCallback, useEffect, useMemo, useState } from "react";
// import { useLeadStore } from "../../store/lead";
// import { filter, find, map, orderBy, size } from "lodash";
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { MdOutlineRefresh } from "react-icons/md";
// import { LoadingContainer } from "../../common/LoadingContainer";
// import { EmptyBox } from "../../common/EmptyBox";
// import { LEADSTATUS, ONLY_MY_LEADS, STATUS } from "../../constant";
// import { Pagination } from "../../common/Pagination";
// import { PageLimit } from "../../common/PageLimit";
// import { Controller, useForm } from "react-hook-form";
// import { FollowUpAndMeetingModal } from "../lead/FollowUpAndMeetingModal";
// import { useStateStore } from "@/store/states";
// import { useLoginStore } from "@/store/login";
// import { PayAmountModal } from "./PayAmountModal";
// import UseStatusCheck from "../../libs/UseStatusCheck";
// import { useMeetingStore } from "@/store/meeting";
// import { MeetingModal } from "./MeetingModal";
// import { MeetingListModal } from "./MeetingListModal";
// import { threeDotsCss } from "@/theme";
// import { getDateRanges } from "@/utils/Helper";
// import { LeadColloboratorModal } from "./collebratorModal";
// const columnHelper = createColumnHelper();
// export const LeadsList = ({ payload }) => {
//   const [leadsId, setLeadsId] = useState();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageLimit, setPageLimit] = useState(10);
//   const [leadStatus, setLeadStatus] = useState();
//   const [leadType, setLeadType] = useState("");
//   const [staffId, setStaffId] = useState();
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectedLeads, setSelectedLeads] = useState([]);
  
//   const { handleSubmit, control, getValues, setValue, watch, onChange } = useForm();

//   const range = watch('rangeDate');

//   const {
//     isOpen: isOpenDrawer,
//     onOpen: onOpenDrawer,
//     onClose: onCloseDrawer,
//   } = useDisclosure();
//   const {
//     isOpen: isOpenModal,
//     onOpen: onOpenModal,
//     onClose: onCloseModal,
//   } = useDisclosure();
//   const {
//     isOpen: isOpenPayModal,
//     onOpen: onOpenPayModal,
//     onClose: onClosePayModal,
//   } = useDisclosure();

//   const { userData } = useLoginStore((s) => ({ userData: s.userData }));

//   const {
//     isOpen: isOpenFollowUpModal,
//     onOpen: onOpenFollowUpModal,
//     onClose: onCloseFollowUpModal,
//   } = useDisclosure();

//   const {
//     isOpen: isMeetingListModal,
//     onOpen: onOpenMeetingListModal,
//     onClose: onCloseMeetingListModal,
//   } = useDisclosure();

//   const {
//     isOpen: isOpenMeetingModal,
//     onClose: onCloseMeetingModal,
//     onOpen: onOpenMeetingModal,
//   } = useDisclosure();

//   // Add collaborator modal
//   const {
//     isOpen: isColloboratorModal,
//     onOpen: onOpenColloboratorModal,
//     onClose: onCloseColloboratorModal,
//   } = useDisclosure();

//   const {
//     getLeadsAction,
//     getLeadsStatus,
//     leadsDetails,
//     getMeetingLeadAction,
//     getMeetingLeadStatus,
//     getfollowUpLeadStatus,
//     getfollowUpLeadAction,
//     updateLeadsAction,
//     updateLeadsStatus,
//     resetStatus,
//   } = useLeadStore((s) => ({
//     getLeadsAction: s.getLeadsAction,
//     getLeadsStatus: s.getLeadsStatus,
//     leadsDetails: s.leadsDetails,
//     getMeetingLeadAction: s.getMeetingLeadAction,
//     getfollowUpLeadAction: s.getfollowUpLeadAction,
//     getMeetingLeadStatus: s.getMeetingLeadStatus,
//     getfollowUpLeadStatus: s.getfollowUpLeadStatus,
//     updateLeadsAction: s.updateLeadsAction,
//     updateLeadsStatus: s.updateLeadsStatus,
//     resetStatus: s.resetStatus,
//   }));

//   const { getStateAction, states } = useStateStore((s) => ({
//     getStateAction: s.getStateAction,
//     states: s.states,
//   }));

//   const addMeetingStatus = useMeetingStore((s) => s.addMeetingStatus);
//   const addLeadFollowUpStatus = useLeadStore((s) => s.addLeadFollowUpStatus);

//   // Handle row selection
//   const handleSelectRow = (lead) => {
//     setSelectedRows((prevSelectedRows) =>
//       prevSelectedRows.includes(lead?._id)
//         ? prevSelectedRows.filter((rowId) => rowId !== lead?._id)
//         : [...prevSelectedRows, lead?._id]
//     );
//     setSelectedLeads((prevSelectedRows) =>
//       prevSelectedRows.find((l) => l?._id === lead?._id)
//         ? prevSelectedRows.filter((rowId) => rowId?._id !== lead?._id)
//         : [...prevSelectedRows, lead]
//     );
//   };

//   // Handle select all
//   const handleSelectAll = () => {
//     if (selectedRows.length === table.getRowModel().rows.length) {
//       setSelectedRows([]);
//       setSelectedLeads([]);
//     } else {
//       const allRowIds = table.getRowModel().rows.map((row) => row.original._id);
//       setSelectedRows(allRowIds);
//       setSelectedLeads(map(table.getRowModel().rows, (r) => r.original));
//     }
//   };

//   // Handle assign collaborator
//   const handleAssignCollaborator = () => {
//     // onOpenColloboratorModal();
//   };

//   UseStatusCheck({
//     status: addMeetingStatus,
//     onSuccess: () => {
//       const params = {
//         page: currentPage,
//         limit: pageLimit,
//         ...getValues(),
//         ...payload,
//       };
//       if (isTeleCaller) {
//         params["telecallerId"] = userData?._id;
//         _getLeads(params);
//       } else {
//         params["staffId"] = userData?._id;
//         _getLeads(params);
//       }
//     },
//     onError: () => {
//       // ErrorAlert("Error while fees deopsit")
//     },
//   });

//   UseStatusCheck({
//     status: addLeadFollowUpStatus,
//     onSuccess: () => {
//       const params = {
//         page: currentPage,
//         limit: pageLimit,
//         ...getValues(),
//         ...payload,
//       };
//       if (isTeleCaller) {
//         params["telecallerId"] = userData?._id;
//         _getLeads(params);
//       } else {
//         params["staffId"] = userData?._id;
//         _getLeads(params);
//       }
//     },
//     onError: () => {
//       // ErrorAlert("Error while fees deopsit")
//     },
//   });

//   const columns = useMemo(
//     () => [
//       columnHelper.accessor("ownerName", {
//         cell: info => {
//           return (
//             <Box>
//               <Text {...threeDotsCss} fontWeight="semibold">
//                 {info.row.original?.ownerName}
//               </Text>
//               <Text>{info.row.original.email}</Text>
//               <Text>{info.row.original.contact}</Text>
//               {info.row.original?.leadSource ? (
//                 <Tag size="sm" colorScheme="defaultColor" mt={1}>
//                   <TagLabel>{info.row.original.leadSource}</TagLabel>
//                 </Tag>
//               ) : null}
//             </Box>
//           );
//         },
//         header: () => "Lead Name",
//         footer: (info) => info.column.id,
//       }),
//       columnHelper.accessor("stateId", {
//         cell: info => {
//           return (
//             <Tooltip label={info.row.original?.staffId?.name}>
//               <Text {...threeDotsCss}>{info.row.original?.staffId?.name}</Text>
//             </Tooltip>
//           )
//         },
//         header: () => "Refer By",
//         footer: (info) => info.column.id,
//       }),
//       columnHelper.accessor("stateManagerId", {
//         cell: info => {
//           return (
//             <Tooltip label={info.row.original?.stateManagerId?.name}>
//               <Text {...threeDotsCss}>{info.row.original?.stateManagerId?.name}</Text>
//             </Tooltip>
//           )
//         },
//         header: () => "Growth Manager",
//         footer: (info) => info.column.id,
//       }),
//       columnHelper.accessor("districtManagerId", {
//         cell: info => {
//           return (
//             <Tooltip label={info.row.original?.districtManagerId?.name}>
//               <Text {...threeDotsCss}>{info.row.original?.districtManagerId?.name}</Text>
//             </Tooltip>
//           )
//         },
//         header: () => "Team Leader",
//         footer: (info) => info.column.id,
//       }),
//     ],
//     []
//   );

//   const table = useReactTable(
//     useMemo(
//       () => ({
//         data: orderBy(leadsDetails?.docs, "createdAt", "desc") || [],
//         columns,
//         columnResizeMode: "onChange",
//         getCoreRowModel: getCoreRowModel(),
//       }),
//       [columns, leadsDetails]
//     )
//   );

//   const handleLeadsDrawer = (id = null) => {
//     onOpenDrawer();
//     setLeadsId(id);
//   };

//   const handleTimelineModal = (id = null, status) => {
//     onOpenModal();
//     setLeadStatus(status);
//     setLeadsId(id);
//   };

//   const handleFollowUpModal = (id = null) => {
//     onOpenFollowUpModal();
//     setLeadsId(id);
//   };

//   const handleMeetingModal = (id) => {
//     onOpenMeetingModal();
//     setLeadsId(id);
//   };

//   const handleMeetingListModal = (id = null) => {
//     onOpenMeetingListModal();
//     setLeadsId(id);
//   };

//   const _getLeads = useCallback(
//     (data) => {
//       if (payload?.isMeetingLead) {
//         if (payload.allLeads) {
//           let params = {
//             ...data,
//             isPopulate: true,
//             status: "MEETING_SCHEDULED"
//           }
//           getLeadsAction(params);
//         } else {
//           getMeetingLeadAction({ ...data });
//         }
//       } else if (payload?.isFollowUpLead) {
//         if (payload.allLeads) {
//           let params = {
//             ...data,
//             isPopulate: true,
//             followUp: true
//           }
//           getLeadsAction(params);
//         } else {
//           getfollowUpLeadAction({ ...data });
//         }
//       } else {
//         let params = { ...data, isPopulate: true }
//         getLeadsAction(params);
//       }
//     },
//     [getLeadsAction, getMeetingLeadAction, getfollowUpLeadAction, payload]
//   );

//   const isTeleCaller = useMemo(
//     () => (userData && userData.role === "CALLER" ? true : false),
//     [userData]
//   );
//   useEffect(() => {
//     const params = {
//       page: currentPage,
//       limit: pageLimit,
//       ...getValues(),
//       ...payload,
//     };
//     if (isTeleCaller) {
//       params["telecallerId"] = userData?._id;
//       _getLeads(params);
//     } else {
//       params["staffId"] = userData?._id;
//       _getLeads(params);
//     }
//   }, [currentPage, pageLimit, getValues, _getLeads, userData, isTeleCaller, payload]);

//   const onApply = () => {
//     const filteredObj = Object.fromEntries(
//       Object.entries(getValues()).filter(([key]) => key !== 'myLeads' || key !== 'rangeDate')
//     );
//     let data = { ...filteredObj };
//     const rangeDate = getValues().rangeDate;
//     console.log("rangeDate", rangeDate);

//     if (getValues().myLeads === 'ONLY_MY_LEADS') {
//       data = { ...data, myLeads: true }
//     }
//     if (rangeDate && rangeDate !== "ALL" && rangeDate !== "CUSTOM") {
//       const [startDate, endDate] = rangeDate.split('|');
//       data = { ...data, startDate, endDate }
//     }
//     getLeadsAction({
//       limit: pageLimit,
//       staffId: userData?._id,
//       ...data,
//       isPopulate: true,
//     });
//     setCurrentPage(1);
//   };

//   const _resetField = () => {
//     getLeadsAction({
//       limit: pageLimit,
//       staffId: userData?._id,
//       isPopulate: true,
//     });
//     setValue("ownerName", "");
//     setValue("contact", "");
//     setValue("stateName", "");
//     setValue("district", "");
//     setCurrentPage(1);
//   };

//   const { totalPages } = leadsDetails || {};

//   useEffect(() => {
//     getStateAction();
//   }, [getStateAction]);

//   const [teamLeader, setTeamLeader] = useState([]);
//   const [trainers, setTrainers] = useState();

//   const selectedState = watch("stateName");
//   const teamLeaderId = watch('districtManagerId');
//   const trainerId = watch('trainerId');
//   const { getTeam, teamStatus, teamList, getTeamDashboard, teamReportStatus, teamDashboard } = useLeadStore();
  
//   useEffect(() => {
//     getTeam();
//   }, [])
  
//   useEffect(() => {
//     if (userData?.role === 'GROWTH_PARTNER') {
//       const teamLeadList = filter(
//         teamList,
//         (staff) => staff.stateManagerId === userData?._id && staff?.role === 'TEAM_LEADER'
//       );
//       setTeamLeader(teamLeadList);
//     } else if (userData?.role === 'TEAM_LEADER') {
//       const teamLeadList = filter(
//         teamList,
//         (staff) => staff.districtManagerId === userData?._id && staff?.role === 'TRAINER'
//       );
//       setTrainers(teamLeadList);
//     }
//   }, [userData, teamList]);

//   useEffect(() => {
//     if (teamLeaderId) {
//       const trainerList = filter(
//         teamList,
//         (staff) => staff.districtManagerId === teamLeaderId
//       );
//       setTrainers(trainerList);
//     }
//   }, [teamLeaderId]);

//   const districtData = useMemo(
//     () => find(states, (state) => state.name == selectedState),
//     [selectedState, states]
//   );

//   const handleViewCollaborator = (id = null) => {
//     onOpenColloboratorModal();
//     setLeadsId(id);
//   };

//   const handleStatus = (status, leadId, data) => {
//     if (status !== "CONVERTED") {
//       updateLeadsAction({
//         id: leadId,
//         status,
//       });
//     }
//     if (status === "CONVERTED") {
//       onOpenPayModal();
//       setLeadType(data.leadType);
//       setLeadsId(leadId);
//       setStaffId(data.staffId);
//     }
//   };

//   useEffect(() => {
//     if (updateLeadsStatus === STATUS.SUCCESS) {
//       resetStatus();
//     }
//   }, [updateLeadsStatus, resetStatus]);

//   return (
//     <Box p={4} bg="white">
//       <Flex justify="space-between" align="end" w="100%" my={3}>
//         <Box w="70%">
//           <form onSubmit={handleSubmit(onApply)}>
//             <HStack flexWrap={'wrap'}>
//               <Controller
//                 control={control}
//                 name="ownerName"
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="Search by Name"
//                     size="sm"
//                     w="200px"
//                   />
//                 )}
//               />
//               <Controller
//                 name="contact"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="Search by Contact"
//                     type="number"
//                     size="sm"
//                     w="200px"
//                   />
//                 )}
//               />
//               {userData?.role === 'GROWTH_PARTNER' ? <Controller
//                 name="districtManagerId"
//                 control={control}
//                 render={({ field }) => (
//                   <Select {...field} placeholder="Select Team Leader" size="sm" w="200px">
//                     {map(teamLeader, (staff) => (
//                       <option key={staff._id} value={staff._id}>
//                         {staff.name}
//                       </option>
//                     ))}
//                   </Select>
//                 )}
//               /> : null}
//               <Controller
//                 name="trainerId"
//                 control={control}
//                 render={({ field }) => (
//                   <Select {...field} placeholder="Select Trainer" size="sm" w="200px">
//                     {map(trainers, (staff) => (
//                       <option key={staff._id} value={staff._id}>
//                         {staff.name}
//                       </option>
//                     ))}
//                   </Select>
//                 )}
//               />
//               <Controller
//                 control={control}
//                 name="status"
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     placeholder="Select Status"
//                     size="sm"
//                     w="200px"
//                   >
//                     {map(LEADSTATUS, (city) => (
//                       <option key={city.id} value={city.id}>
//                         {city.title}
//                       </option>
//                     ))}
//                   </Select>
//                 )}
//               />
//               <Controller
//                 control={control}
//                 name="myLeads"
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     placeholder="Select Leads"
//                     size="sm"
//                     w="200px"
//                   >
//                     {map(ONLY_MY_LEADS, (city) => (
//                       <option key={city.id} value={city.id}>
//                         {city.title}
//                       </option>
//                     ))}
//                   </Select>
//                 )}
//               />
//               <Controller
//                 control={control}
//                 name="rangeDate"
//                 render={({ field }) => (
//                   <Select w="200px" size="sm" {...field}>
//                     <option value={"ALL"}>All Leads</option>
//                     <option value={getDateRanges().todayRange}>Today</option>
//                     <option value={getDateRanges().yesterdayRange}>Yesterday</option>
//                     <option value={getDateRanges().thisWeekRange}>This Week</option>
//                     <option value={getDateRanges().thisMonthRange}>This Month</option>
//                     <option value={getDateRanges().lastMonthRange}>Last Month</option>
//                     <option value={'CUSTOM'}>Select Date Range</option>
//                   </Select>
//                 )}
//               />
//               {range === 'CUSTOM' ? <Controller
//                 control={control}
//                 name="startDate"
//                 render={({ field }) =>
//                   <Input {...field} size="sm" type="date" w="150px" />
//                 }
//               /> : null}
//               {range === 'CUSTOM' ? <Controller
//                 control={control}
//                 name="endDate"
//                 render={({ field }) =>
//                   <Input {...field} size="sm" type="date" w="150px" />
//                 }
//               /> : null}
//               <HStack>
//                 <Button
//                   size="sm"
//                   type="submit"
//                   colorScheme="defaultColor"
//                   color="white"
//                 >
//                   Apply
//                 </Button>
//                 <Button
//                   size="sm"
//                   colorScheme="blue"
//                   leftIcon={<MdOutlineRefresh fontSize="18px" />}
//                   onClick={_resetField}
//                 >
//                   Reset
//                 </Button>
//               </HStack>
//             </HStack>
//           </form>
//         </Box>
//         <PageLimit
//           pageLimit={pageLimit}
//           setPageLimit={setPageLimit}
//           setCurrentPage={setCurrentPage}
//         />
//       </Flex>

//       {/* Selected rows actions */}
//       {size(selectedRows) > 0 ? (
//         <Flex align="center" w="100%" my={3}>
//           <CloseButton
//             onClick={() => {
//               setSelectedRows([]);
//               setSelectedLeads([]);
//             }}
//             fontSize={14}
//             color={"red"}
//             mr={1}
//           />
//           <Text>{`${size(selectedRows)} Leads Selected`}</Text>
//           <Button
//             size="sm"
//             colorScheme="blue"
//             ml={5}
//             // onClick={handleAssignCollaborator}
//           >
//             Assign Collaborator
//           </Button>
//         </Flex>
//       ) : null}

//       <LoadingContainer
//         loading={
//           getLeadsStatus === STATUS.FETCHING ||
//           getfollowUpLeadStatus === STATUS.FETCHING ||
//           getMeetingLeadStatus === STATUS.FETCHING
//         }
//       >
//         <TableContainer
//           pt={5}
//           style={{
//             borderBottomLeftRadius: "10px",
//             borderBottomRightRadius: "10px",
//           }}
//         >
//           <Table bg="white">
//             <Thead>
//               {table?.getHeaderGroups().map((headerGroup) => (
//                 <Tr key={headerGroup.id}>
//                   {/* Checkbox header */}
//                   <Th>
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedRows.length === table.getRowModel().rows.length &&
//                         table.getRowModel().rows.length > 0
//                       }
//                       onChange={handleSelectAll}
//                     />
//                   </Th>
//                   {map(headerGroup.headers, (header) => {
//                     return (
//                       <Th h={10} left={0} key={header.id}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                       </Th>
//                     );
//                   })}
//                   {/* <Th>Lead Type</Th> */}
//                   <Th>Status</Th>
//                   <Th>Actions</Th>
//                 </Tr>
//               ))}
//             </Thead>
//             <Tbody>
//               {table.getRowModel().rows && table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => {
//                   const status = find(
//                     leadsDetails.docs,
//                     (lead) => lead?._id === row.original?._id
//                   );
//                   return (
//                     <Tr key={row.original?._id} color="gray.500">
//                       {/* Checkbox cell */}
//                       <Td>
//                         <input
//                           type="checkbox"
//                           checked={selectedRows.includes(row.original._id)}
//                           onChange={() => handleSelectRow(row.original)}
//                         />
//                       </Td>
//                       {row.getVisibleCells().map((cell) => {
//                         return (
//                           <Td
//                             borderRightColor="gray.100"
//                             bg="white"
//                             key={cell.id}
//                             left={0}
//                             maxW={200}
//                             overflowWrap="break-word"
//                           >
//                             <Box>
//                               {flexRender(
//                                 cell.column.columnDef.cell,
//                                 cell.getContext()
//                               )}
//                             </Box>
//                           </Td>
//                         );
//                       })}
//                       <Td>
//                         {status?.leadSource && (
//                           <Tag
//                             borderRadius="full"
//                             variant="solid"
//                             colorScheme="green"
//                           >
//                             <TagLabel>{status?.leadSource}</TagLabel>
//                           </Tag>
//                         )}
//                         {/* {status?.leadType && (
//                           <Tag
//                             borderRadius="full"
//                             variant="solid"
//                             colorScheme="green"
//                           >
//                             <TagLabel>{status?.leadType}</TagLabel>
//                           </Tag>
//                         )} */}
//                       </Td>
//                       <Td>
//                         {status.status === "CONVERTED" ? (
//                           <Text>{status.status}</Text>
//                         ) : (
//                           <Select
//                             placeholder="Select Current Status"
//                             w="200px"
//                             onChange={(e) =>
//                               handleStatus(
//                                 e.target.value,
//                                 row.original?._id,
//                                 status
//                               )
//                             }
//                             value={status?.status}
//                             size="sm"
//                           >
//                             {map(LEADSTATUS, (status) => (
//                               <option key={status.id} value={status.id}>
//                                 {status.title}
//                               </option>
//                             ))}
//                           </Select>
//                         )}
//                       </Td>
//                       <Td>
//                         <HStack spacing={2}>
//                           <Box
//                             color="blue.400"
//                             onClick={() => handleLeadsDrawer(row.original?._id)}
//                             cursor="pointer"
//                           >
//                             View
//                           </Box>
//                           {status.status !== "CONVERTED" && (
//                             <Box
//                               color="green.400"
//                               onClick={() => {
//                                 if (status.status === "MEETING_SCHEDULED") {
//                                   handleMeetingModal(row.original?._id, status);
//                                 } else {
//                                   handleTimelineModal(
//                                     row.original?._id,
//                                     status
//                                   );
//                                 }
//                               }}
//                               cursor="pointer"
//                             >
//                               {status.status === "MEETING_SCHEDULED"
//                                 ? "Add Meeting"
//                                 : "Add Followup"}
//                             </Box>
//                           )}
//                           {/* Add Meeting option */}
//                           {/* <Box
//                             color="purple.400"
//                             onClick={() => handleMeetingModal(row.original?._id)}
//                             cursor="pointer"
//                           >
//                             Add Meeting
//                           </Box> */}

//                           <Box
//                               color="blue.400"
//                               border={1}
//                               onClick={() =>
//                                 handleViewCollaborator(row.original?._id)
//                               }
//                               cursor="pointer"
//                             >
//                               View Colloborators
//                             </Box>
//                           <Box
//                             color="red.400"
//                             onClick={() =>
//                               handleFollowUpModal(row.original?._id)
//                             }
//                             cursor="pointer"
//                           >
//                             Followups
//                           </Box>
//                           <Box
//                             color="green.400"
//                             onClick={() =>
//                               handleMeetingListModal(row.original?._id)
//                             }
//                             cursor="pointer"
//                           >
//                             View Meetings
//                           </Box>
//                         </HStack>
//                       </Td>
//                     </Tr>
//                   );
//                 })
//               ) : (
//                 <Tr>
//                   <Td colSpan={7}>
//                     <EmptyBox title="Leads not found" />
//                   </Td>
//                   </Tr>
//                 )
//               }
//             </Tbody>
//           </Table>
//         </TableContainer>
//       </LoadingContainer>
//       <Pagination
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         totalPages={totalPages}
//       />
//       {isOpenDrawer && (
//         <LeadDrawer
//           isOpen={isOpenDrawer}
//           onClose={onCloseDrawer}
//           leadsId={leadsId}
//         />
//       )}
//       {isOpenModal && (
//         <TimelineModal
//           isOpen={isOpenModal}
//           onClose={onCloseModal}
//           leadId={leadsId}
//           status={leadStatus.status}
//         />
//       )}
//       {isOpenFollowUpModal && (
//         <FollowUpAndMeetingModal
//           isOpen={isOpenFollowUpModal}
//           onClose={onCloseFollowUpModal}
//           leadId={leadsId}
//         />
//       )}
//       {isOpenPayModal && (
//         <PayAmountModal
//           isOpen={isOpenPayModal}
//           onClose={onClosePayModal}
//           leadId={leadsId}
//           leadType={leadType}
//           staffId={staffId}
//         />
//       )}

//       {isOpenMeetingModal && (
//         <MeetingModal
//           isOpen={isOpenMeetingModal}
//           onClose={onCloseMeetingModal}
//           leadId={leadsId}
//         />
//       )}

//       {isMeetingListModal && (
//         <MeetingListModal
//           isOpen={isMeetingListModal}
//           onClose={onCloseMeetingListModal}
//           leadId={leadsId}
//         />
//       )}

//       {/* Collaborator Assignment Modal */}
//       {/* {isColloboratorModal && (
//         <AssignCollaboratorModal
//           isOpen={isColloboratorModal}
//           onClose={onCloseColloboratorModal}
//           leads={selectedLeads}
//         />
//       )} */}

//       {isColloboratorModal && (
//         <LeadColloboratorModal
//           isOpen={isColloboratorModal}
//           onClose={onCloseColloboratorModal}
//           leadId={leadsId}
//         />
//       )}
//     </Box>
//   );
// };

// export const LeadTable = () => {
//   const { userData } = useLoginStore((s) => ({ userData: s.userData }));
//   const isTeleCaller = useMemo(
//     () => (userData && userData.role === "CALLER" ? true : false),
//     [userData]
//   );
//   const LEADTABS = ["All", "Bucket", "Follow-ups", "Meetings", "Conversions"];

//   return (
//     <Tabs size="md" variant="enclosed" isLazy>
//       <TabList>
//         {map(LEADTABS, (tab, index) => (
//           <Tab key={index}>{tab}</Tab>
//         ))}
//       </TabList>
//       <TabPanels>
//         <TabPanel>
//           <LeadsTab />
//         </TabPanel>
//         <TabPanel>
//           <LeadsTab payload={{ isBucket: true }} />
//         </TabPanel>
//         <TabPanel>
//           <LeadsTab isShowTab={true} payload={{ isFollowUpLead: true }} />
//         </TabPanel>
//         <TabPanel>
//           <LeadsTab isShowTab={true} payload={{ isMeetingLead: true }} />
//         </TabPanel>
//         <TabPanel>
//           <LeadsTab payload={{ isConverted: true }} />
//         </TabPanel>
//       </TabPanels>
//     </Tabs>
//   );
// };

// const LeadsTab = ({ isShowTab, payload }) => {
//   const tabCss = {
//     border: "1px solid",
//     borderColor: "gray.100",
//   };
//   return (
//     <Box>
//       {isShowTab ? (
//         <Tabs
//           size="sm"
//           variant="soft-rounded"
//           colorScheme="green"
//           isFitted
//           defaultIndex={0}
//           isLazy
//         >
//           <TabList>
//             <Tab _selected={{ color: "white", bg: "blue.200" }} {...tabCss}>
//               All
//             </Tab>
//             <Tab _selected={{ color: "white", bg: "red.200" }} {...tabCss}>
//               Missed
//             </Tab>
//             <Tab _selected={{ color: "white", bg: "green.200" }} {...tabCss}>
//               Today
//             </Tab>
//             <Tab _selected={{ color: "white", bg: "blue.200" }} {...tabCss}>
//               Upcoming
//             </Tab>
//           </TabList>
//           <TabPanels>
//             <TabPanel>
//               <LeadsList payload={{ ...payload, allLeads: true }} />
//             </TabPanel>
//             <TabPanel>
//               <LeadsList payload={{ ...payload, passed: true }} />
//             </TabPanel>
//             <TabPanel>
//               <LeadsList payload={{ ...payload, today: true }} />
//             </TabPanel>
//             <TabPanel>
//               <LeadsList payload={{ ...payload, upcoming: true }} />
//             </TabPanel>
//           </TabPanels>
//         </Tabs>
//       ) : (
//         <LeadsList payload={payload} />
//       )}
//     </Box>
//   );
// };
