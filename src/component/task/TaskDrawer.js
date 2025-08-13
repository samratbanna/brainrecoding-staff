import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { ErrorAlert } from "@/utils/Helper";
import { useAddTask } from "@/services/task.service";
import {
  useGetBottomHeirarchy,
  useGetTopHeirarchy,
} from "@/services/staff.service";
import { map } from "lodash";

export const TaskDrawer = ({ isOpen, onClose, task, taskId, userData }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { data: teamListBottom, isLoading: loadingBottom } = useGetBottomHeirarchy({
    staffId: userData?._id,
  });

  const { data: teamListTop, isLoading: loadingTop } = useGetTopHeirarchy({
    staffId: userData?._id,
  });

  // Merge and deduplicate staff lists
  const uniqueStaff = useMemo(() => {
    const combined = [
      ...(teamListBottom?.docs || []),
      ...(teamListTop?.docs || []),
    ];
    return combined.filter(
      (staff, index, self) =>
        index === self.findIndex((s) => s?._id === staff?._id)
    );
  }, [teamListBottom, teamListTop]);

  const { mutate: addTask, isPending: loading } = useAddTask({
    onSuccess() {
      onClose();
      reset();
    },
    onError(e) {
      ErrorAlert(e?.message || "Error");
    },
  });

  const onSubmit = (data) => {
    if (taskId) {
      // Handle update case if needed
    } else {
      addTask(data);
    }
  };

  return (
    <Drawer size={"md"} isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`${taskId ? "Update" : "Add New"} Task`}</DrawerHeader>
          <DrawerBody>
            <Flex gap={2} flexDir={{ base: "column", lg: "column", xl: "row" }}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input {...field} size="sm" placeholder="Enter Title" />
                  )}
                />
              </FormControl>
            </Flex>

            <Flex
              gap={2}
              mt={5}
              flexDir={{ base: "column", lg: "column", xl: "row" }}
            >
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="sm"
                      placeholder="Enter Description"
                    />
                  )}
                />
              </FormControl>
            </Flex>

            <Box className="mt-2"></Box>

            <Flex
              gap={2}
              mt={5}
              flexDir={{ base: "column", lg: "column", xl: "row" }}
            >
              <FormControl>
                <FormLabel>Select Staff</FormLabel>
                {loadingBottom || loadingTop ? (
                  <Spinner size="sm" />
                ) : (
                  <Controller
                    control={control}
                    name="assignedTo"
                    render={({ field }) => (
                      <Select {...field} placeholder="Select Staff">
                        {map(uniqueStaff, (s) => (
                          <option key={`staff:${s?._id}`} value={s?._id}>
                            {s?.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                )}
              </FormControl>
            </Flex>

            <Flex
              gap={2}
              mt={5}
              flexDir={{ base: "column", lg: "column", xl: "row" }}
            >
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      size="sm"
                      placeholder="Enter Due Date"
                    />
                  )}
                />
              </FormControl>
            </Flex>
          </DrawerBody>

          <Box className="mt-2"></Box>

          <DrawerFooter>
            <Button size="sm" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              loadingText="Loading"
              isLoading={loading}
              size="sm"
              colorScheme="defaultColor"
              type="submit"
            >
              {task ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
