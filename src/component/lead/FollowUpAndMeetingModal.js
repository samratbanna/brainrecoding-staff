import { EmptyBox } from "@/common/EmptyBox";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect } from "react";
import { useLeadStore } from "../../store/lead"

export const FollowUpAndMeetingModal = ({ isOpen, onClose, leadId }) => {
  const { getLeadFollowUpAction, leadFollowUpDetails, getLeadFollowUpStatus } = useLeadStore(
    (s) => ({
      getLeadFollowUpAction: s.getLeadFollowUpAction,
      leadFollowUpDetails: s.leadFollowUpDetails,
      getLeadFollowUpStatus: s.getLeadFollowUpStatus,
    })
  );

  useEffect(() => {
    getLeadFollowUpAction({ leadId });
  }, [getLeadFollowUpAction]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent color={"black"}>
        <ModalHeader>Lead Follow Ups</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer loading={getLeadFollowUpStatus === STATUS.FETCHING}>
            {leadFollowUpDetails?.length !== 0 ? (
              <Stack spacing={3} pb={5}>
                {map(leadFollowUpDetails, (followUp) => {
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
                          <b>Title</b> &nbsp;&nbsp; : &nbsp;&nbsp; {followUp.title}
                        </Text>
                      )}
                      {followUp.remark && (
                        <Text isTruncated>
                          <b>Remark</b> &nbsp;&nbsp; : &nbsp;&nbsp; {followUp.remark}
                        </Text>
                      )}
                      {followUp.dateTime && (
                        <Text>
                          <b>Next Followup Date</b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {dayjs(followUp.dateTime).format("DD MMM, YYYY hh:mm a")}
                        </Text>
                      )}
                      <Text>
                        <b>Added At : </b> &nbsp;&nbsp; : &nbsp;&nbsp;
                        {dayjs(followUp.createdAt).format("DD MMM, YYYY hh:mm a")}
                      </Text>
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
