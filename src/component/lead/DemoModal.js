import { useEffect } from "react";
import { STATUS } from "@/constant";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useMeetingStore } from "@/store/meeting";
import { assign, map, size } from "lodash";
import { useGetBottomHeirarchy } from "@/services/staff.service";
import { useLoginStore } from "@/store/login";

export const DemoModal = ({ isOpen, onClose, leadId, status }) => {
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));
  const { control, setValue, handleSubmit, watch } = useForm();

  const { addMeetingAction, addMeetingStatus, resetStatus } = useMeetingStore(
    (s) => ({
      addMeetingAction: s.addMeetingAction,
      addMeetingStatus: s.addMeetingStatus,
      updateMeetingAction: s.updateMeetingAction,
      updateMeetingStatus: s.updateMeetingStatus,
      resetStatus: s.resetStatus,
      meetingDetails: s.meetingDetails,
    })
  );

  const onSubmit = (data) => {
    addMeetingAction({
      leadId,
      ...data,
      isDemo: true,
      assignedTo: data.assignedTo,
      meetingtype: "ONLINE",
    });
  };

  useEffect(() => {
    if (addMeetingStatus === STATUS.SUCCESS) {
      // resetStatus();
      onClose();
    }
  }, [addMeetingStatus, onClose]);

  const { data: teamList, isLoading } = useGetBottomHeirarchy({
    staffId: userData?._id,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader color={"black"}>Add Demo</ModalHeader>
          <ModalCloseButton />
          <ModalBody color={"black"}>
            <Box>
              <Flex gap={3}>
                <>
                  <FormControl mt={4}>
                    <FormLabel>Title</FormLabel>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input placeholder="Enter title" {...field} size="sm" />
                      )}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Zoom Link</FormLabel>
                    <Controller
                      control={control}
                      name="url"
                      render={({ field }) => (
                        <Input
                          placeholder="Enter Zoom Link"
                          {...field}
                          size="sm"
                        />
                      )}
                    />
                  </FormControl>
                </>
              </Flex>
              <Flex gap={3}>
                <FormControl mt={4}>
                  <FormLabel>Date</FormLabel>
                  <Controller
                    control={control}
                    name="dateTime"
                    render={({ field }) => (
                      <Input {...field} type="date" size="sm" />
                    )}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Time</FormLabel>
                  <Controller
                    control={control}
                    name="time"
                    render={({ field }) => (
                      <Input {...field} type="time" size="sm" />
                    )}
                  />
                </FormControl>
              </Flex>
              <FormControl mt={4}>
                <FormLabel>Assigned To</FormLabel>
                <Controller
                  control={control}
                  name="assignedTo"
                  render={({ field }) => (
                    <Select
                      placeholder="Select Assigned To"
                      {...field}
                      size="sm"
                    >
                      {teamList && map([...teamList, userData] || [], (staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button size="sm" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={addMeetingStatus === STATUS.FETCHING}
              type="submit"
              colorScheme="defaultColor"
              size="sm"
            >
              Add Demo
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
