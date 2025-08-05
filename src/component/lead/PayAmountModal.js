import { STATUS } from "@/constant";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLeadStore } from "../../store/lead"

export const PayAmountModal = ({
  isOpen,
  onClose,
  leadId,
}) => {
  const { handleSubmit, watch } = useForm();

  const {
    updateLeadsAction,
    resetStatus,
    leadConvertAction,
    leadConvertStatus,
  } = useLeadStore(s => ({
    updateLeadsAction: s.updateLeadsAction,
    resetStatus: s.resetStatus,
    leadConvertAction: s.leadConvertAction,
    leadConvertStatus: s.leadConvertStatus,
  }));


  const onSubmit = () => {
    leadConvertAction({ leadId });
  };

  useEffect(() => {
    if (leadConvertStatus === STATUS.SUCCESS) {
      updateLeadsAction({ id: leadId, status: "CONVERTED" });
      resetStatus();
      onClose();
    }
  }, [leadConvertStatus, resetStatus, updateLeadsAction, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader color={"black"}>Convert lead to sales</ModalHeader>
          <ModalCloseButton />
          <ModalBody color={"black"}>
            Are you sure you want to convert this lead to sales?
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="blue"
              size="sm"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              type="cancel"
              colorScheme="defaultColor"
              isLoading={leadConvertStatus === STATUS.FETCHING}
            >
              Convert
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
