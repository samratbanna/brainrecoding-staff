import { AspectRatio, Center, Modal, Image, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react"

export const FullScreenImageModal = ({ isOpen, onClose, imageDetail }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent minH='60vh'>
                <ModalCloseButton zIndex={2} bg='white' />
                <ModalBody>
                    <Center bg='white' mt={3}>
                        <AspectRatio ratio={1} flex={1}>
                            <Image src={imageDetail?.image || "assets/emptyPng.png"} objectFit='cover' w='full' crossOrigin='anonymous' />
                        </AspectRatio>
                    </Center>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}