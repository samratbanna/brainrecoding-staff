// TaskList.tsx
import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  Text,
  Badge,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  HStack,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { PageHeading } from "@/common/PageHeading";
import { useGetBottomHeirarchy, useStaffList } from "@/services/staff.service";
import { map, size, sortBy, update } from "lodash";
import { TaskDrawer } from "./TaskDrawer";
import {
  useAddTask,
  useTaskList,
  useUpdateTask,
} from "@/services/task.service";
import { useLoginStore } from "@/store/login";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineRefresh } from "react-icons/md";
import { LEADSTATUS, TASK_STATUS } from "@/constant";

const statusColors = {
  PENDING: "gray",
  IN_PROGRESS: "blue",
  HOLD: "orange",
  COMPLETED: "green",
  CANCELLED: "red",
};

export const TaskList = () => {
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [state, setState] = useState();
  const [task, setTask] = useState();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { teamTask, setTeamTask } = useState(false);
  const [params, setParams] = useState({ page, limit, isTeamTask: teamTask });

  const handleStateDrawer = (state = null) => {
    setState(state);
    onOpen();
  };

  const { data: staffList, isLoading } = useStaffList();

  const {
    data: tasks,
    isLoading: loading,
    refetch,
  } = useTaskList({
    assignedTo: userData?._id,
    page,
    limit,
    isTeamTask: teamTask,
  });

  const { mutate: updateTask, isPending } = useUpdateTask({
    onSuccess() {
      refetch();
    },
    onError(e) {
      ErrorAlert(e?.message || "Error");
    },
  });

  const { handleSubmit, control, getValues, setValue, watch } = useForm();
  const { data: teamList, isLoading: loadingg } = useGetBottomHeirarchy({
    staffId: userData?._id,
  });
  useEffect(() => {
    _resetField();
    setParams({ page, limit, isTeamTask: teamTask });
    refetch();
  }, [teamTask]);
  const onApply = (data) => {
    let payload = { page: 1, limit, isTeamTask: teamTask };
    if (data?.name) {
      payload = { ...payload, name: data?.name };
    }
    if (data?.dueDate) {
      payload = { ...payload, dueDate: data?.dueDate };
    }
    if (data?.status) {
      payload = { ...payload, status: data?.status };
    }
    if (data?.assignedTo) {
      payload = { ...payload, assignedTo: data?.assignedTo };
    }
    if (data?.createdBy) {
      payload = { ...payload, createdBy: data?.createdBy };
    }
    setParams({
      page: 1,
      limit,
      ...payload,
    });
    setPage(1);
    refetch();
  };

  const _resetField = () => {
    setParams({ page: 1, limit });
    setValue("name", "");
    setValue("dueDate", "");
    setValue("status", "");
    setValue("assignedTo", "");
    setValue("createdBy", "");
    setPage(1);
    refetch();
  };

  const handleStatus = (status, taskId, data) => {
    if (status !== "CONVERTED") {
      updateTask({
        id: taskId,
        status,
      });
    }
  };

  return (
    <Box p={6} bg="white" minH="100vh">
      <Flex direction={"row"} justify="space-between" align="center" mb={4}>
        <PageHeading heading="Tasks" desc="View Tasks" />
        <Button
          size="sm"
          colorScheme="defaultColor"
          onClick={() => handleStateDrawer()}
          leftIcon={<AddIcon />}
        >
          Add Task
        </Button>
      </Flex>
      {/* Filters */}
      <Box w="100%">
        <form onSubmit={handleSubmit(onApply)}>
          <HStack flexWrap={"wrap"}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search by Title"
                  size="sm"
                  w="200px"
                />
              )}
            />
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <Input {...field} size="sm" type="date" w="150px" />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Status"
                  size="sm"
                  w="200px"
                >
                  {map(Object.keys(statusColors), (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Assigned To"
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

            <Controller
              name="createdBy"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Assigned By"
                  size="sm"
                  w="200px"
                >
                  {map(
                    sortBy(staffList?.docs, (t) => t?.name),
                    (staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.name}
                      </option>
                    )
                  )}
                </Select>
              )}
            />

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

      {/* Record Info */}
      <Text mb={2}>Total Records: {tasks?.totalDocs || 0}</Text>
      <Flex justify="end" justifyItems={"center"} alignItems={"center"} my={2}>
        <Switch
          isChecked={teamTask}
          onCheckedChange={(e) => {
            setTeamTask(e.checked);
          }}
        >
          Team Task
        </Switch>
      </Flex>
      {/* Table */}
      <Box borderRadius="lg" overflow="hidden" boxShadow="sm" bg="white">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Assigned To</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Created By</Th>
            </Tr>
          </Thead>
          <Tbody>
            {map(tasks?.docs || [], (task, i) => (
              <Tr key={i}>
                <Td>{task.title}</Td>
                <Td>{task.description}</Td>
                <Td>{task?.assignedTo?.name}</Td>
                <Td>{new Date(task.dueDate).toLocaleDateString()}</Td>
                <Td>
                  {task.status === "COMPLETED" &&
                  task?.assignedTo !== userData?._id ? (
                    <Text>{task.status}</Text>
                  ) : (
                    <Select
                      placeholder="Select Current Status"
                      w="200px"
                      onChange={(e) =>
                        handleStatus(e.target.value, task?._id, task)
                      }
                      value={task?.status}
                      size="sm"
                    >
                      {map(TASK_STATUS, (status) => (
                        <option key={status.id} value={status.id}>
                          {status.title}
                        </option>
                      ))}
                    </Select>
                  )}
                </Td>
                <Td>{task.createdBy ? task?.createdBy?.name : "-"}</Td>
                <Td>{new Date(task.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" align="center" mt={4}>
        <Box flex={1} />
        <Select
          placeholder="Select option"
          onChange={(e) => setLimit(e.target.value)}
          value={limit}
          w="240px"
          mr={5}
        >
          <option value={10}>10 Records Per Page</option>
          <option value={20}>20 Records Per Page</option>
          <option value={30}>30 Records Per Page</option>
          <option value={40}>40 Records Per Page</option>
          <option value={50}>50 Records Per Page</option>
          <option value={100}>100 Records Per Page</option>
        </Select>
        <HStack>
          <IconButton
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            icon={<ChevronLeftIcon />}
            aria-label="Prev"
            variant="outline"
            size="sm"
          />
          <Text>{`${page} out of ${tasks?.totalPages}`}</Text>
          <IconButton
            disabled={page == tasks?.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            icon={<ChevronRightIcon />}
            aria-label="Next"
            variant="outline"
            size="sm"
          />
        </HStack>
      </Flex>
      {isOpen && (
        <TaskDrawer
          isOpen={isOpen}
          onClose={onClose}
          task={task}
          taskId={task?._id}
        />
      )}
    </Box>
  );
};
