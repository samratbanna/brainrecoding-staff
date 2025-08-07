import {
  AspectRatio,
  Box,
  Grid,
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
    <Box bg="white" p={4} minH="100vh">
      <PageHeading heading="Rewards" />
      <LoadingContainer loading={getLectureStatus === STATUS.FETCHING}>
        <Grid
          mt={6}
          templateColumns={[
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(5, 1fr)",
          ]}
          gap={6}
        >
          {orderBy(lectures, "createdAt", "desc").map((file, index) => (
            <Box
              key={index}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)", boxShadow: "md" }}
              onClick={() => handleFullScreenImage(file)}
            >
              <AspectRatio ratio={1}>
                <Image
                  src={file.image || "assets/emptyPng.png"}
                  alt={file.title}
                  objectFit="cover"
                  crossOrigin="anonymous"
                />
              </AspectRatio>
              <Box p={2} bg="gray.50">
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  isTruncated
                  color="gray.600"
                  textAlign="center"
                >
                  {file.title}
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
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
