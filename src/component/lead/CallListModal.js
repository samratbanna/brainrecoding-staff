import { EmptyBox } from "@/common/EmptyBox";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "../../constant";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect } from "react";
import { useLeadStore } from "../../store/lead";
import { callLogStatus } from "./LeadsList";

export const CallLogListModal = ({ isOpen, onClose, leadId }) => {
  const { getAllCallLogActions, callLogs, getcallLogStatus } = useLeadStore(
    (s) => ({
      getAllCallLogActions: s.getAllCallLogActions,
      callLogs: s.callLogs,
      getcallLogStatus: s.getcallLogStatus,
    })
  );

  useEffect(() => {
    getAllCallLogActions({ leadId });
  }, [getAllCallLogActions]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent color={"black"}>
        <ModalHeader>Lead Call Logs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer loading={getcallLogStatus === STATUS.FETCHING}>
            {callLogs?.length !== 0 ? (
              <Stack spacing={3} pb={5}>
                {map(callLogs, (followUp) => {
                  return (
                    <Stack
                      spacing={2}
                      border={"1px solid"}
                      borderColor={"gray.300"}
                      p={3}
                      pl={5}
                      borderRadius={"md"}
                    >
                      {followUp.title && (
                        <Text>
                          <b>Title</b> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
                          {followUp.title}
                        </Text>
                      )}
                      {followUp.remark && (
                        <Text isTruncated>
                          <b>Remark</b> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
                          {followUp.remark}
                        </Text>
                      )}
                      {followUp.dateTime && (
                        <Text>
                          <b>Followup At</b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {dayjs(followUp.dateTime).format("DD-MMM-YY hh:mm a")}
                        </Text>
                      )}
                      {followUp.callStatus && (
                        <Text>
                          <b>Followup At</b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {callLogStatus[followUp.callStatus]}
                        </Text>
                      )}
                      {followUp.createdAt && (
                        <Text>
                          <b>Added At: </b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {dayjs(followUp.createdAt).format(
                            "DD MMM, YYYY hh:mm a"
                          )}
                        </Text>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <EmptyBox title="No FollowUps Found" />
            )}
          </LoadingContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
