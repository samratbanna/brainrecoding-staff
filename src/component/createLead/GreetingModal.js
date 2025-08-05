import { useLeadStore } from "@/store/lead"
import { Box, Center, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react"
import { compact, find, map, join } from "lodash"
import { TiTick } from "react-icons/ti"

export const GreetingModal = ({ isOpen, onClose }) => {
    const { particularLead } = useLeadStore(s => ({ particularLead: s.particularLead }))
    const { schoolAddress,
        state,
        district,
        tehsil,
        blockName,
        pincode } = particularLead || {}

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Box p={6}>
                        <Center><Box borderRadius={50} border="3px solid" color='green.400' borderColor='green.400'><TiTick fontSize={50} /></Box></Center>
                        <Text color='green.400' mt={2} fontSize="3xl" fontWeight='bold'>Thanks for Submitting the form!</Text>
                        <Box my={2}>
                            {map(HEADING, h => {
                                const leadData = find(particularLead, (v, k) => k === h.id)
                                const isCheckAddress = h.id == 'address' ? true : false
                                const addressDetail = h.id === 'address' && compact([schoolAddress, blockName, tehsil, district, state, pincode]).join(", ")
                                return (
                                    <Stack>
                                        {!isCheckAddress ?
                                            <Box mb={3}>
                                                <FormLabel fontWeight='semibold'>{h.title}</FormLabel>
                                                <Text mt={-2} color='gray.500'>{leadData}</Text>
                                            </Box>
                                            :
                                            <Box mb={3}>
                                                <FormLabel fontWeight='semibold'>Address</FormLabel>
                                                <Text mt={-2} color='gray.500'>{addressDetail}</Text>
                                            </Box>
                                        }
                                    </Stack >
                                )
                            }
                            )}
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
const HEADING = [
    { title: 'Owner Name', id: 'ownerName' },
    { title: 'School Name', id: 'schoolName' },
    { title: 'Email', id: 'email' },
    { title: 'Contact', id: 'contact' },
    { title: 'WhatsApp Number', id: 'whatsAppNumber' },
    { title: 'School Medium', id: 'schoolMedium' },
    { title: 'School Type', id: 'schoolType' },
    { title: 'Total Student', id: 'totalStudent' },
    { title: 'Fee of fifth class', id: 'fees' },
    { title: 'Address', id: 'address' },
]