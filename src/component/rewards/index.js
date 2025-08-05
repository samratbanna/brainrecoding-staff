import {
  AspectRatio,
  Box,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { useLectureStore } from "../../store/lecture";
import { STATUS } from "../../constant";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";
import { LoadingContainer } from "@/common/LoadingContainer";
import { FullScreenImageModal } from "./FullScreenImageModal";

export const Rewards = () => {
  const { getLectureAction, getLectureStatus, lectures } = useLectureStore(
    (s) => ({
      getLectureAction: s.getLectureAction,
      getLectureStatus: s.getLectureStatus,
      lectures: s.lectures,
    })
  );

  const [imageDetail, setImageDetail] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    getLectureAction({ isAdmin: true });
  }, [getLectureAction]);

  const handleFullScreenImage = (fileDetail) => {
    onOpen();
    setImageDetail(fileDetail);
  };

  return (
    <Box bg="white" p={3} minH="100vh">
      <PageHeading heading="Rewards" />
      <LoadingContainer loading={getLectureStatus === STATUS.FETCHING}>
        <Box p={3} minH="100vh" mt={4}>
          <Flex wrap="wrap">
            {orderBy(lectures, "createdAt", "desc").map((file, index) => {
              return (
                <Box
                  w="220px"
                  key={index}
                  m={2}
                  border="3px solid"
                  borderColor="gray.50"
                  borderRadius="10px"
                  my={3}
                  mr={3}
                  onClick={() => handleFullScreenImage(file)}
                  textAlign="center"
                >
                  <AspectRatio ratio={1} key={index}>
                    <Image
                      borderRadius="4px 4px 0px 0px"
                      src={file.image || "assets/emptyPng.png"}
                      alt="image"
                      objectFit="cover"
                      crossOrigin="anonymous"
                    />
                  </AspectRatio>
                  <Text
                    display="inline-block"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    w="100px"
                    textOverflow="ellipsis"
                    fontWeight="semibold"
                    color="gray.400"
                  >
                    {file.title}
                  </Text>
                </Box>
              );
            })}
          </Flex>
        </Box>
      </LoadingContainer>
      {isOpen && (
        <FullScreenImageModal
          isOpen={isOpen}
          onClose={onClose}
          imageDetail={imageDetail}
        />
      )}
    </Box>
  );
};
