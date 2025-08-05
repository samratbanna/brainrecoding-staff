import { useEffect } from "react";
import { STATUS } from "@/constant";
import { useLeadStore } from "../../store/lead";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";

export const TimelineModal = ({ isOpen, onClose, leadId, status }) => {
    const { control, setValue, handleSubmit, watch } = useForm();

    const { addLeadFollowUpAction, addLeadFollowUpStatus, resetStatus, leadFollowUpDetails } =
        useLeadStore((s) => ({
            addLeadFollowUpAction: s.addLeadFollowUpAction,
            addLeadFollowUpStatus: s.addLeadFollowUpStatus,
            resetStatus: s.resetStatus,
            leadFollowUpDetails: s.leadFollowUpDetails,
        }));

    const follow = watch("follow");
    const onSubmit = (data) => {
        addLeadFollowUpAction({
            leadId,
            ...data,
        });
    };

    useEffect(() => {
        if (addLeadFollowUpStatus === STATUS.SUCCESS) {
            resetStatus();
            onClose();
        }
    }, [addLeadFollowUpStatus, resetStatus, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>TimeLine</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <FormControl>
                                <Controller
                                    control={control}
                                    name="follow"
                                    render={({ field }) => <Checkbox {...field}>Need to follow?</Checkbox>}
                                />
                            </FormControl>
                            {follow && (
                                <FormControl mt={4}>
                                    <FormLabel>Date on</FormLabel>
                                    <Controller
                                        control={control}
                                        name="dateTime"
                                        render={({ field }) => <Input {...field} type="datetime-local" size="sm" />}
                                    />
                                </FormControl>
                            )}
                            <FormControl isRequired mt={2}>
                                <FormLabel>Remarks</FormLabel>
                                <Controller
                                    control={control}
                                    name="remark"
                                    render={({ field }) => (
                                        <Textarea {...field} size="sm" placeholder="Enter remarks here.." />
                                    )}
                                />
                            </FormControl>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            isLoading={addLeadFollowUpStatus === STATUS.FETCHING}
                            type="submit"
                            colorScheme="defaultColor"
                            size="sm"
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
};
