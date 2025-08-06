import { EmptyBox } from "@/common/EmptyBox";
import { LoadingContainer } from "@/common/LoadingContainer";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { map } from "lodash";
import {useGetLeadColloborator} from '@/services/lead.service';
import { useEffect, useState } from "react";

export const LeadColloboratorModal = ({ isOpen, onClose, leadId }) => {
  
  const [staffList, setStaffList]=  useState([]);
  const { mutate: getLeadColoborator, isPending } = useGetLeadColloborator({
    onSuccess: (response) => {
      console.log("response", response);
      setStaffList(response?.docs)
    }
  });
  useEffect(() => {
    getLeadColoborator({
      leadId,
      noPaginate: true,
    });
  }, [])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent color={"black"}>
        <ModalHeader>Colloborator List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer loading={isPending}>
            {staffList?.length !== 0 ? (
              <Stack spacing={3} pb={5}>
                {map(staffList, (lead) => {
                  const seller = lead?.staffId;
                  return (
                    <Flex
                      border={"1px solid gray"}
                      borderRadius={"md"}
                      p={2}
                      cursor="pointer"
                      align={"center"}
                      pr={10}
                      pl={3}
                      justify={"space-between"}
                    >
                      <Box color={"blue.600"}>
                        <Text
                          fontWeight={500}
                          color={"black"}
                        >
                          {seller.name}
                        </Text>
                        <Text
                          fontWeight={500}
                          color={"black"}
                        >
                          {seller.contact}
                        </Text>
                      </Box>
                    </Flex>
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
