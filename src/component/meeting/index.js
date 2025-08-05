import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { useEffect } from "react";
import { useMeetingStore } from "@/store/meeting";
import { map } from "lodash";
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
          <SimpleGrid columns={4} gap={16} mt={3} textAlign={"left"}>
            {map(meetings, (meet) => {
              return (
                <Box
                  borderRadius={"md"}
                  p={2}
                  pl={5}
                  textAlign={"center"}
                  border={"2px"}
                  borderColor={"gray.400"}
                >
                  <Text as={"b"} fontSize={"xl"}>
                    {meet.title}
                  </Text>
                  <Text as={"p"} fontSize={"lg"} mt={2} color={"gray.600"}>
                    {dayjs(meet.dateTime).format("dddd, MMMM D, YYYY h:mm A")}
                  </Text>
                  {meet.url ? (
                    <Button mt={3} colorScheme="green">
                      <a href={meet.url} target="_blank">
                        Join Now
                      </a>
                    </Button>
                  ) : null}
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </LoadingContainer>
    </Box>
  );
};
