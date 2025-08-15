import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { AiOutlineLink } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useLoginStore } from "@/store/login";

export const ShareLeadModal = ({ isOpen, onClose }) => {
  const [referCodeLink, setReferCodeLink] = useState("");
  const { onCopy, setValue, hasCopied } = useClipboard(referCodeLink);

  const { userData } = useLoginStore((s) => ({ userData: s.userData }));

  useEffect(() => {
    setReferCodeLink(
      `http://app.brainrecoding.in/createLead/?id=${userData?._id}&type=${userData?.type}`
    );
  }, [setReferCodeLink, userData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box>
            <Text>Share Lead</Text>
            <Divider />
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody minH="30vh">
          <Box px={3} py={1}>
            <Text>Share this link via</Text>
            <HStack mt={2} my={4} spacing={2}>
              <FacebookShareButton url={referCodeLink}>
                <IconButton
                  icon={<FaFacebook />}
                  colorScheme="facebook"
                ></IconButton>
              </FacebookShareButton>
              <TwitterShareButton url={referCodeLink}>
                <IconButton
                  icon={<FaTwitter />}
                  colorScheme="twitter"
                ></IconButton>
              </TwitterShareButton>
              <WhatsappShareButton separator=":: " url={referCodeLink}>
                <IconButton
                  icon={<FaWhatsapp />}
                  colorScheme="green"
                ></IconButton>
              </WhatsappShareButton>
              <IconButton
                icon={<FiExternalLink />}
                colorScheme="blue"
                onClick={() => window.open(referCodeLink, "_blank")}
                aria-label="Open in new tab"
              />
            </HStack>

            <Text mb={4}>Or copy link</Text>
            <Flex gap={2}>
              <InputGroup>
                <InputLeftAddon pointerEvents="none">
                  <AiOutlineLink />
                </InputLeftAddon>
                <Input
                  isReadOnly
                  value={referCodeLink}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              </InputGroup>
              <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
