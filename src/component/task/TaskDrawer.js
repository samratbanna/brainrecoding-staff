import { useEffect } from "react";
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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { ErrorAlert } from "@/utils/Helper";
import { useAddTask } from "@/services/task.service";
import { useStaffList } from "@/services/staff.service";
import { map } from "lodash";

export const TaskDrawer = ({ isOpen, onClose, task, taskId }) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      // manager: "",
    },
  });

  const { data: staffList, isLoading: staffLoading } = useStaffList({
    isPopulate: true,
    noPaginate: true,
  });

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
    console.log("data", data);
    
    if (taskId) {
    } else {
      addTask(data);
    }
  };

  // useEffect(() => {
  //   if (state) {
  //     const {
  //       name,
  //       manager
  //     } = state || {};
  //     setValue("name", name);
  //     setValue("manager", schoolName);
  //   }
  // }, [state]);

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
                <Controller
                  control={control}
                  name="assignedTo"
                  render={({ field }) => (
                    <Select {...field} placeholder="Select Staff">
                      {map(staffList?.docs, (s) => (
                        <option key={`staff:${s?._id}`} value={s?._id}>
                          {s?.name}
                        </option>
                      ))}
                    </Select>
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
              isLoading={false}
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
