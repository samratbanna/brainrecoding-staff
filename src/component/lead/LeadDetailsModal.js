import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { join } from "lodash";
import React from "react";

export const LeadDetailsModal = ({ lead, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box>
            <Text>{lead.ownerName}</Text>
            <Divider />
          </Box>
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody minH="30vh">
          <Stack spacing={3} pb={5}>
            <Box>
              <Text as={"b"}>Owner Name</Text>
              <Text>{lead.ownerName}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Mobile</Text>
              <Text>{lead.contact}</Text>
            </Box>
            <Box>
              <Text as={"b"}>WhatsApp</Text>
              <Text>{lead.whatsAppNumber}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Email</Text>
              <Text>{lead.email}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Address</Text>
              <Text>
                {join(
                  [lead.schoolAddress, lead.blockName, lead.tehsil, lead.district, lead.state],
                  ", "
                )}
              </Text>
            </Box>
            <Box>
              <Text as={"b"}>Medium</Text>
              <Text>{lead.schoolMedium}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Type</Text>
              <Text>{lead.schoolType}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Total Students</Text>
              <Text>{lead.totalStudent}</Text>
            </Box>
            <Box>
              <Text as={"b"}>Fee</Text>
              <Text>{lead.fees}</Text>
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
