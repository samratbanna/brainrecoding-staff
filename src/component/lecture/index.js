import { AspectRatio, Box, Center, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { useEffect } from "react";
import { useLectureStore } from "@/store/lecture";
import { map } from "lodash";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { EmptyBox } from "@/common/EmptyBox";

export const Lecture = () => {
  const { getLectureAction, getLectureStatus, lectures } = useLectureStore(
    (s) => ({
      getLectureAction: s.getLectureAction,
      getLectureStatus: s.getLectureStatus,
      lectures: s.lectures,
    })
  );

  useEffect(() => {
    getLectureAction({ isLecture: true });
  }, [getLectureAction]);

  return (
    <Box bg="white" p={3} minH="100vh">
      <PageHeading heading="Lecture" desc="show list of Lecture" />
      <LoadingContainer loading={getLectureStatus === STATUS.FETCHING}>
        {!lectures?.length ? (
          <EmptyBox
            title="No Lectures Found"
            desc="Wait For Next Meeting Schedule"
          />
        ) : (
          <SimpleGrid columns={4} gap={16} mt={3} textAlign={"left"}>
            {map(lectures, (lect) => {
              console.log("lecture",lect)
              return (
                <Box
                  border={"2px solid"}
                  borderColor={"gray.400"}
                  borderRadius={"md"}
                  textAlign={"center"}
                  onClick={() => window.open(lect.videoUrl, "")}
                >
                  {/* <AspectRatio h={"200px"} ratio={1}> */}
                  <Center>
                    <Image
                      src={
                        "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                      }
                      boxSize='100px'
    objectFit='cover'
                    />
                    </Center>
                  {/* </AspectRatio> */}
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    {lect.title}
                  </Text>
                  <Text color={"gray.400"}>{lect.dateTime}</Text>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </LoadingContainer>
    </Box>
  );
};
