import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  HStack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useLeadStore } from "@/store/lead";
import { find, map } from "lodash";
import { LEAD_ADDED_BY_TYPE, STATUS } from "@/constant";
import { GreetingModal } from "./GreetingModal";
import { useGetAreas, useGetDistricts, useGetStates } from "@/services/state.service";


export const Form = () => {
  const { isOpen: isOpenGreetModal, onOpen: onOpenGreetModal, onClose: onCloseGreetModal } = useDisclosure()
  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      ownerName: "",
      schoolName: "",
      contact: "",
      whatsAppNumber: "",
      email: "",
      schoolAddress: "",
      schoolMedium: "",
      schoolType: "",
      state: "",
      district: "",
      area: "",
      tehsil: "",
      blockName: "",
      totalStudent: "",
      fees: "",
      pincode: "",
      aboutYou: "", 
      message: "",
    },
  });

  const searchParams = useSearchParams();
  const sellerId = searchParams.get("id");
  const leadType = searchParams.get("type");
  
  const { createLeadStatus, createLeadAction, resetStatus } = useLeadStore(
    (s) => ({
      createLeadStatus: s.createLeadStatus,
      createLeadAction: s.createLeadAction,
      resetStatus: s.resetStatus,
    })
  );

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedArea = watch("area");

  // Fetch states
  const { 
    data: states = [], 
    isLoading: isLoadingStates 
  } = useGetStates();

  // Find selected state data
  const selectedStateData = useMemo(
    () => find(states, (state) => state.name === selectedState),
    [selectedState, states]
  );

  // Fetch districts when state is selected
  const { 
    data: districts = [], 
    isLoading: isLoadingDistricts 
  } = useGetDistricts(
    selectedStateData?.id || selectedStateData?._id,
    !!(selectedStateData?.id || selectedStateData?._id)
  );

  // Find selected district data
  const selectedDistrictData = useMemo(
    () => find(districts, (district) => district.name === selectedDistrict),
    [selectedDistrict, districts]
  );

  // Fetch areas when district is selected
  const { 
    data: areas = [], 
    isLoading: isLoadingAreas 
  } = useGetAreas(
    selectedStateData?.id || selectedStateData?._id,
    selectedDistrictData?.id || selectedDistrictData?._id,
    !!(selectedStateData?.id || selectedStateData?._id) && 
    !!(selectedDistrictData?.id || selectedDistrictData?._id)
  );

  // Find selected area data
  const selectedAreaData = useMemo(
    () => find(areas, (area) => area.name === selectedArea),
    [selectedArea, areas]
  );

  // Reset dependent fields when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("district", "");
      setValue("area", "");
      setValue("pincode", "");
    }
  }, [selectedState, setValue]);

  // Reset area field when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setValue("area", "");
      setValue("pincode", "");
    }
  }, [selectedDistrict, setValue]);

  // Auto-fill pincode when area is selected and has pincode
  useEffect(() => {
    if (selectedAreaData?.pincode) {
      setValue("pincode", selectedAreaData.pincode);
    }
  }, [selectedAreaData, setValue]);

  const onSubmit = (data) => {
    createLeadAction({
      ...data,
      isActive: true,
      leadType: leadType === "FRANCHISE" ? "FRANCHISE" : "BRAIN", 
      staffId: sellerId,
    });
  };

  useEffect(() => {
    if (createLeadStatus === STATUS.SUCCESS) {
      onOpenGreetModal()
      reset();
      resetStatus();
    }
  }, [createLeadStatus, reset, resetStatus, onOpenGreetModal]);

  const roleCss = {
    p: 1,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    borderRadius: "lg",
    border: "2px solid",
  };

  return (
    <Box
      bg="white"
      color="black"
      p={7}
      minW={{ lg: "60%", md: "40vw", sm: "40vw" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          w={{ lg: "40%", md: "50%", sm: "60%", base: "100%" }}
          m="auto"
          mt={4}
          px={7}
          pb={7}
          pt={4}
          borderRadius="md"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.300"
        >
          <Heading textAlign="center" size="md">
            Brain Recoding
          </Heading>
          <Heading textAlign="center" size="md">
            Application Form
          </Heading>
          <HStack w={"100%"} mt={1} justify="center">
            {/* Model selection commented out as in original */}
          </HStack>
          <FormControl isRequired mt={2}>
            <FormLabel>Name</FormLabel>
            <Controller
              control={control}
              name="ownerName"
              render={({ field }) => (
                <Input {...field} size="sm" placeholder="Name" />
              )}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>About Yourself</FormLabel>
            <Controller
              control={control}
              name="aboutYou"
              render={({ field }) => (
                <Select
                  {...field}
                  size="sm"
                  placeholder="Select About Yourself"
                >
                  {map(LEAD_ADDED_BY_TYPE, (state) => (
                    <option key={state.id} value={state.id}>
                      {state.title}
                    </option>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Business/School Name</FormLabel>
            <Controller
              control={control}
              name="schoolName"
              render={({ field }) => (
                <Input
                  size="sm"
                  {...field}
                  placeholder="Business/School Name"
                />
              )}
            />
          </FormControl>
          <Flex gap={2} flexDir={{ base: "column", lg: "column", xl: "row" }}>
            <FormControl isRequired>
              <FormLabel>Mobile</FormLabel>
              <Controller
                control={control}
                name="contact"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="ex. 9876543210"
                    type="tel"
                    size="sm"
                    maxLength={10}
                    minLength={10}
                    pattern="[6-9]{1}[0-9]{9}"
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Whatsapp Number</FormLabel>
              <Controller
                control={control}
                name="whatsAppNumber"
                render={({ field }) => (
                  <Input
                    {...field}
                    size="sm"
                    placeholder="ex. 9876543210"
                    type="tel"
                    maxLength={10}
                    minLength={10}
                    pattern="{6-9}[1]{0-9}[9]"
                  />
                )}
              />
            </FormControl>
          </Flex>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  placeholder="abc@emample.com"
                  pattern="^([0-9]{9})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$"
                  type="email"
                />
              )}
            />
          </FormControl>

          <Flex gap={2} flexDir={{ base: "column", lg: "column", xl: "row" }}>
            <FormControl isRequired>
              <FormLabel>State</FormLabel>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select 
                    {...field} 
                    size="sm" 
                    placeholder={isLoadingStates ? "Loading states..." : "Select State"}
                    disabled={isLoadingStates}
                  >
                    {map(states, (state) => (
                      <option key={state.name || state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>District</FormLabel>
              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <Select 
                    {...field} 
                    size="sm" 
                    placeholder={
                      isLoadingDistricts 
                        ? "Loading districts..." 
                        : !selectedState 
                        ? "Select State first"
                        : "Select District"
                    }
                    disabled={!selectedState || isLoadingDistricts}
                  >
                    {map(districts, (district) => (
                      <option key={district.name || district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Flex>
          <FormControl isRequired>
            <FormLabel>Area</FormLabel>
            <Controller
              control={control}
              name="area"
              render={({ field }) => (
                <Select 
                  {...field} 
                  size="sm" 
                  placeholder={
                    isLoadingAreas
                      ? "Loading areas..."
                      : !selectedDistrict
                      ? "Select District first"
                      : "Select Area"
                  }
                  disabled={!selectedDistrict || isLoadingAreas}
                >
                  {map(areas, (area) => (
                    <option key={area._id || area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>PinCode</FormLabel>
            <Controller
              control={control}
              name="pincode"
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  placeholder="Enter 6 digit Pincode"
                  pattern="{0-9}[6]"
                  type="tel"
                  maxLength={6}
                  minLength={6}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Controller
              control={control}
              name="schoolAddress"
              render={({ field }) => (
                <Textarea
                  {...field}
                  size="sm"
                  placeholder="Enter School Address"
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Message (If any)</FormLabel>
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <Textarea {...field} size="sm" placeholder="Enter Message" />
              )}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="defaultColor"
            variant="solid"
            w="full"
            mt={3}
            isLoading={createLeadStatus === STATUS.FETCHING}
          >
            Submit
          </Button>
        </Stack>
      </form>
      {isOpenGreetModal && (
        <GreetingModal isOpen={isOpenGreetModal} onClose={onCloseGreetModal} />
      )}
    </Box>
  );
};