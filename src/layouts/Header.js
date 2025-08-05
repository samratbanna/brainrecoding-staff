import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ConfirmAlert } from "../common/ConfirmAlert";
import { useState } from "react"
import { useLoginStore } from "@/store/login";


export const DashboardHeader = ({ toggleSidebarMenu }) => {
  const [showAlert, setShowAlert] = useState()
  const { logoutUser, userData } = useLoginStore(s => ({
    logoutUser: s.logoutUser,
    userData: s.userData,
  }))

  const handleLogout = () => {
    logoutUser();
  }

  const handleShowModal = () => {
    onOpen();
  };

  return (
    <Box
      px={{ base: 3, lg: 6 }}
      py={2}
      bg="defaultColor.500"
      borderBottom="1px solid"
      borderColor={"gray.200"}
    >
      <Flex justify="space-between" align='center'>
        <Flex align={{ base: "start", lg: "center" }}>
          <Box
            onClick={toggleSidebarMenu}
            mr={{ base: 2, lg: 0 }}
            alignSelf="center"
            display={{ base: "block", lg: "none" }}
          >
            <GiHamburgerMenu />
          </Box>
          <Flex
            align="center"
            maxW={{ base: 140, md: 220, lg: 275 }}
            minW={{ lg: 275 }}
            cursor="pointer"
          >
            <Center px={{ base: 1, lg: 2 }} py={{ base: 2, lg: 2 }}>
              {
                <Image
                  w={[{ base: "239px", md: "263px", lg: "263px" }]}
                  h={{ lg: "50px", md: "45px", base: "40px" }}
                  size="md"
                  src="assets/brainRecoding.jpg"
                  alt="logo"
                />
              }
            </Center>
            <Box fontWeight="bold">
              <Text noOfLines={1}>
                <Text fontSize={{ base: "md", lg: "lg" }} color="white">
                  Brain Recoding
                </Text>
              </Text>
            </Box>
          </Flex>
        </Flex>
        <HStack spacing={6}>
          <Button variant='outline' bg='white' colorScheme='defaultColor' onClick={() => setShowAlert(true)}>
            Logout
          </Button>
          <Box color='white'>
            <Text fontWeight='semibold' fontSize={18} color='white'>{userData?.name}</Text>
            <Text color='white' fontSize={14} mt={-1}>{userData?.contact}</Text>
          </Box>
        </HStack>
      </Flex>
      {showAlert && (
        <ConfirmAlert
          isOpen={true}
          onClose={() => setShowAlert(false)}
          message="Are you sure you want to Logout?"
          heading="Logout?"
          onConfirm={handleLogout}
          buttonTitle='Logout'
        />
      )}
    </Box>
  );
}
