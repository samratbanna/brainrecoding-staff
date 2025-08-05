import { Box, Button, Center, Heading, Image } from "@chakra-ui/react";
import React from "react";

export const EmptyBox = (props) => {
  const { desc, title, buttonClickHandler, buttonTitle } = props;

  return (
    <Box
      bg="white"
      borderRadius={10}
      py={{ base: 10, md: 14, lg: 20 }}
      px={{ base: 10, md: 14, lg: 8 }}
    >
      <Center>
        <Image alt="empty" w={{ lg: 300 }} src="/assets/emptyBox.jpg" />
      </Center>
      <Box textAlign="center" mt={4}>
        <Heading desc={desc}>{title || "nothing found"}</Heading>
      </Box>
      {buttonClickHandler && (
        <Center>
          <Button
            onClick={buttonClickHandler}
            mt={10}
            size="md"
            variant={"outline"}
            colorScheme="defaultColor"
          >
            {buttonTitle || "Add"}
          </Button>
        </Center>
      )}
    </Box>
  );
};
