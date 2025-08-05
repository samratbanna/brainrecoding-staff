import { useEffect } from "react";
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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useMeetingStore } from "../../store/meeting";
import {STATUS} from '../../constant'

export const MeetingModal = ({ isOpen, onClose, leadId, status }) => {
  const { control, setValue, handleSubmit, watch } = useForm();

  const { addMeetingAction, addMeetingStatus } = useMeetingStore(
    (s) => ({
      addMeetingAction: s.addMeetingAction,
      addMeetingStatus: s.addMeetingStatus,
    })
  );

  const onSubmit = (data) => {
    addMeetingAction({
      leadId,
      ...data,
    });
  };

  useEffect(() => {
    if (addMeetingStatus === STATUS.SUCCESS) {
      onClose();
    }
  }, [addMeetingStatus, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader color={"black"}>Add Meeting</ModalHeader>
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
              Add Meeting
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
