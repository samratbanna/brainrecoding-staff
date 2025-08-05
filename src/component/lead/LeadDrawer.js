import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Tag,
} from "@chakra-ui/react";
import { find, join, map } from "lodash";
import { useEffect, useState } from "react";
import { useLeadStore } from "../../store/lead";
import dayjs from "dayjs";

export const LeadDrawer = ({ isOpen, onClose, leadsId }) => {
  const [staffLead, setStaffLead] = useState();

  const { getLeadsStatus, leadsDetails } = useLeadStore((s) => ({
    getLeadsStatus: s.getLeadsStatus,
    leadsDetails: s.leadsDetails,
  }));

  useEffect(() => {
    if (leadsDetails) {
      setStaffLead(find(leadsDetails.docs, (lead) => lead?._id === leadsId));
    }
  }, [leadsDetails, leadsId]);

  let {
    ownerName,
    contact,
    email,
    status,
    whatsAppNumber,
    totalStudent,
    state,
    district,
    tehsil,
    aboutYou,
    createdAt,
    customFields,
    message,
    leadSource,
  } = staffLead || {};
  console.log("staffLead", staffLead);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Lead Details</DrawerHeader>
        <DrawerBody>
          <LoadingContainer loading={getLeadsStatus === STATUS.FETCHING}>
            <DataValue title="Name" value={ownerName} />
            <DataValue title="School Name" value={staffLead?.schoolName} />
            <DataValue title="Contact" value={contact} />
            <DataValue title="WhatsApp Number" value={whatsAppNumber} />
            <DataValue title="About You" value={aboutYou} />
            <DataValue title="message" value={message} />
            <DataValue title="Lead Source" value={leadSource} />
            <DataValue title="Email" value={email} />
            <DataValue title="Total Student" value={totalStudent} />
            <DataValue title="5th Class Fees" value={staffLead?.fees} />
            <DataValue title="Board" value={staffLead?.schoolType} />
            <DataValue title="Medium" value={staffLead?.schoolMedium} />
            <DataValue title="Modal" value={staffLead?.leadType} />
            <DataValue title="Status" value={status} />
            <DataValue
              title="Lead Added At"
              value={dayjs(createdAt).format("DD MMM, YYYY hh:mm a")}
            />
            <DataValue
              title="Address"
              value={join(
                [
                  staffLead?.schoolAddress,
                  state,
                  district,
                  tehsil,
                  staffLead?.pincode,
                ],
                ", "
              )}
            />
            {map(customFields, (field) => (
              <DataValue key={field.id} title={field.key} value={field.value} />
            ))}
          </LoadingContainer>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const DataValue = ({ title, value }) => {
  return value ? (
    <Box my={2}>
      <Text fontSize={16} color={"#0081F8"} fontWeight="bold">
        {title}
      </Text>
      <Text>{value}</Text>
    </Box>
  ) : null;
};
