import { Box, Button, Flex, Switch, useDisclosure } from "@chakra-ui/react";
import { PageHeading } from "../../common/PageHeading";
import { ShareLeadModal } from "../lead/ShareLeadModal";
import { AiOutlineShareAlt } from "react-icons/ai";
import { LeadTable, LeadsList } from "./LeadsList"
import { useMemo, useState } from "react"
import { useLoginStore } from "../../store/login"

export const Lead = () => {
  const [onlyMyLead, setOnlyMyLead] = useState(false);
  console.log("onlyMyLead", onlyMyLead);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userData } = useLoginStore(s => ({
    userData: s.userData,
  }));

  const handleLeadModal = (id = null) => {
    onOpen();
  };

  const isFindTeleCaller = useMemo(() => (userData && userData?.role === 'CALLER') ? true : false, [userData])

  return (
    <Box bg='white' p={4} minH='100vh'>
      <PageHeading heading="Leads" desc="create Leads" />
      {!isFindTeleCaller ?
        <Flex justify="end">
          {/* <Switch checked={onlyMyLead} onCheckedChange={(e) => {
            console.log("e", e);
            setOnlyMyLead(e.checked)
          }} >Show Only My Leads</Switch> */}
          <Button
            size="sm"
            colorScheme="defaultColor"
            onClick={() => handleLeadModal()}
            leftIcon={<AiOutlineShareAlt />}
          >
            Share Lead
          </Button>
        </Flex>
        :
        null
      }
      <LeadTable onlyMyLead={onlyMyLead} />
      {isOpen && <ShareLeadModal isOpen={isOpen} onClose={onClose} />}
    </Box>
  );
};
