import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { useEffect } from "react";
import { useMeetingStore } from "@/store/meeting";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import dayjs from "dayjs";
import { EmptyBox } from "@/common/EmptyBox";

export const Meeting = () => {
  const { getMeetingAction, getMeetingStatus, meetings } = useMeetingStore(
    (s) => ({
      getMeetingAction: s.getMeetingAction,
      getMeetingStatus: s.getMeetingStatus,
      meetings: s.meetings,
    })
  );

  useEffect(() => {
    getMeetingAction();
  }, [getMeetingAction]);

  return (
    <Box bg="white" p={3} minH="100vh">
      <PageHeading heading="Meeting" desc="Show list of Meeting" />
      <LoadingContainer loading={getMeetingStatus === STATUS.FETCHING}>
        {!meetings?.length ? (
          <EmptyBox
            title="No Meetings Found"
            desc="Wait For Next Meeting Schedule"
          />
        ) : (
          <Box overflowX="auto" mt={5}>
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Title</Th>
                  <Th>Date & Time</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {meetings.map((meet, idx) => (
                  <Tr key={idx}>
                    <Td>
                      <Text as="b">{meet.title}</Text>
                    </Td>
                    <Td>
                      {dayjs(meet.dateTime).format(
                        "dddd, MMMM D, YYYY h:mm A"
                      )}
                    </Td>
                    <Td>
                      {meet.url ? (
                        <Button colorScheme="green" as="a" href={meet.url} target="_blank">
                          Join Now
                        </Button>
                      ) : (
                        <Text color="gray.500">No link</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </LoadingContainer>
    </Box>
  );
};
