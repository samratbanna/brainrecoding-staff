import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LoadingContainer } from "../../common/LoadingContainer";
import { Controller, useForm } from "react-hook-form";
import { map } from "lodash";
import { Pagination } from "@/common/Pagination";
import { MdOutlineRefresh } from "react-icons/md";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useAssignMultipleCollaborator } from "@/services/lead.service";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { useGetBottomHeirarchy } from "@/services/staff.service";
import { useLoginStore } from "@/store/login";

export const AssignCollaboratorModal = ({ isOpen, onClose, leadIds }) => {
  const { userData } = useLoginStore((s) => ({ userData: s.userData }));
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState();

  const { data: sellerDetails, isLoading } = useGetBottomHeirarchy({
    staffId: userData?._id,
  });

  const { mutate: assignMultipleLead, isPending } =
    useAssignMultipleCollaborator({
      onSuccess: (response) => {
        SuccessAlert("Lead Assigned Successfully");
        onClose();
      },
      onError: (error) => {
        ErrorAlert("Error while assign lead");
      },
    });

  const handleSelect = (telecaller) => {
    assignMultipleLead({
      leadIds: leadIds,
      staffId: telecaller?._id,
    });
    setSelected(telecaller._id);
  };

  const { totalPages } = sellerDetails || {};
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={"full"}>
        <ModalHeader>Assign Colloborator</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer loading={isLoading}>
            <Stack mt={3}>
              {map(sellerDetails, (seller) => {
                const telecaller = {
                  _id: seller._id,
                  name: seller.name,
                  isTelecaller: true,
                };
                const isSelected = selected === seller._id ? true : false;
                return (
                  seller._id && (
                    <Flex
                      border={isSelected ? "1px solid green" : "1px solid gray"}
                      borderRadius={"md"}
                      p={2}
                      cursor="pointer"
                      align={"center"}
                      pr={10}
                      pl={3}
                      justify={"space-between"}
                      onClick={() => handleSelect(telecaller)}
                    >
                      <Box color={"blue.600"}>
                        <Text
                          fontWeight={500}
                          color={isSelected ? "green.600" : "black"}
                        >
                          {seller.name}
                        </Text>
                        <Text
                          fontWeight={500}
                          color={isSelected ? "green.600" : "black"}
                        >
                          {seller.contact}
                        </Text>
                      </Box>
                      {isSelected && (
                        <Box>
                          <CheckCircleIcon boxSize={6} color={"green.600"} />
                        </Box>
                      )}
                    </Flex>
                  )
                );
              })}
            </Stack>
          </LoadingContainer>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
