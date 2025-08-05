import { Button, Center, HStack, Text, Tooltip } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

export const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const goToNext = () => {
    setCurrentPage((p) => p + 1);
  };

  const goToPrev = () => {
    setCurrentPage((p) => p - 1);
  };

  return (
    <Center p={3}>
      <HStack>
        <Tooltip label="Previous">
          <Button
            variant="flushed"
            onClick={goToPrev}
            size="sm"
            role="group"
            mr={-3}
            color={"black"}
            isDisabled={currentPage == 1}
          >
            <ArrowLeftIcon transition="all 0.2s" _groupHover={{ mr: "10px" }} />
          </Button>
        </Tooltip>
        <Center>
          <Text mr={-2}>
            {`${currentPage || 1} of ${totalPages || 1} page`}
          </Text>
        </Center>
        <Tooltip label="Next">
          <Button
            variant="flushed"
            onClick={goToNext}
            role="group"
            size="sm"
            ml={-1}
            color={"black"}
            isDisabled={currentPage == totalPages}
          >
            <ArrowRightIcon
              transition="all 0.2s"
              _groupHover={{ ml: "10px" }}
            />
          </Button>
        </Tooltip>
      </HStack>
    </Center>
  );
};
