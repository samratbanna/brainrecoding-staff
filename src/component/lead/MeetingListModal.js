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
import { LoadingContainer } from "../../common/LoadingContainer";
import { EmptyBox } from "../../common/EmptyBox";
import { useMeetingStore } from "../../store/meeting";
import { STATUS } from "@/constant";

export const MeetingListModal = ({ isOpen, onClose, leadId }) => {

  const { getMeetingAction, getMeetingStatus, meetingDetails } =
    useMeetingStore((s) => ({
      getMeetingAction: s.getMeetingAction,
      getMeetingStatus: s.getMeetingStatus,
      meetingDetails: s.meetings,
    }));

  useEffect(() => {
    getMeetingAction({ leadId });
  }, [getMeetingAction, leadId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent color={"black"}>
        <ModalHeader>Meeting List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer loading={getMeetingStatus === STATUS.FETCHING}>
            {meetingDetails?.length !== 0 ? (
              <Stack spacing={3} pb={5}>
                {map(meetingDetails, (meeting) => {
                  return (
                    <Stack
                      spacing={2}
                      border={"1px solid"}
                      borderColor={"gray.300"}
                      p={3}
                      pl={5}
                      borderRadius={"md"}
                    >
                      {meeting.title && (
                        <Text>
                          <b>Title</b> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
                          {meeting.title}
                        </Text>
                      )}

                      {meeting.url && (
                        <Text>
                          <b>URL</b> &nbsp;&nbsp; : &nbsp;&nbsp;{" "}
                          <a href={meeting.url}>Zoom Link (Click to Join)</a>
                        </Text>
                      )}
                      
                      {meeting.dateTime && (
                        <Text>
                          <b>Date</b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {dayjs(meeting.dateTime).format("DD MMM YY")}
                        </Text>
                      )}

                      {meeting.time && (
                        <Text>
                          <b>Time</b> &nbsp;&nbsp; : &nbsp;&nbsp;
                          {dayjs("10-10-2023 " + meeting.time, 'DD-MM-YYYY HH:mm').format("hh:mm a")}
                        </Text>
                      )}
                    </Stack>
                  );
                })}
              </Stack>
            ) : (
              <EmptyBox title="No Meeting Found" />
            )}
          </LoadingContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
