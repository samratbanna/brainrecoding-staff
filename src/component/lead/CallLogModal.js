import { useEffect } from "react";
import { STATUS } from "@/constant";
import { useLeadStore } from "@/store/lead";
import {
  Box,
  Button,
  Checkbox,
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
  Textarea,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { map } from "lodash";
import UseStatusCheck from "@/libs/UseStatusCheck";
import { useLoginStore } from "@/store/login";

const data = [
  {
    id: "ANSWERED",
    value: "Answered",
  },
  {
    id: "INVALID_NUMBER",
    value: "Invalid Number",
  },
  {
    id: "NO_ANSWER",
    value: "No Answer",
  },
  {
    id: "BUSY",
    value: "Busy",
  },
];

export const CallLogModal = ({ isOpen, onClose, leadId, status }) => {
  const { control, setValue, handleSubmit, watch } = useForm();
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));

  const { addCallLogAction, addCallLogStatus, resetStatus } = useLeadStore(
    (s) => ({
      addCallLogAction: s.addCallLogAction,
      addCallLogStatus: s.addCallLogStatus,
      resetStatus: s.resetStatus,
    })
  );

  const follow = watch("follow");
  const onSubmit = (data) => {
    addCallLogAction({
      leadId,
      assignedTo: userData?._id,
      ...data,
    });
  };

  UseStatusCheck({
    status: addCallLogStatus,
    onSuccess: () => {
      resetStatus();
      onClose();
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader color={"black"}>Call Log</ModalHeader>
          <ModalCloseButton />
          <ModalBody color={"black"}>
            <Box>
              <FormControl isRequired mt={2}>
                <FormLabel>Remarks</FormLabel>
                <Controller
                  control={control}
                  name="remark"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      size="sm"
                      placeholder="Enter remarks here.."
                    />
                  )}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Call Status</FormLabel>
                <Controller
                  control={control}
                  name="callStatus"
                  render={({ field }) => (
                    <Select
                      placeholder="Select Call Status"
                      {...field}
                      size="sm"
                    >
                      {map(data || [], (status) => (
                        <option key={status.id} value={status.id}>
                          {status.value}
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
              isLoading={addCallLogStatus === STATUS.FETCHING}
              type="submit"
              colorScheme="defaultColor"
              size="sm"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
