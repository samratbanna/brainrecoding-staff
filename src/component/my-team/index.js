import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Button,
    Text,
    useToast,
    Center,
} from "@chakra-ui/react";
import {
    useGetBottomHeirarchy,
    useInActiveStaff,
} from "@/services/staff.service";
import { useLoginStore } from "@/store/login";

export function MyTeam() {
    const toast = useToast();
    const { userData } = useLoginStore((s) => ({
        userData: s.userData,
    }));

    const { data: teamList, isLoading, refetch } = useGetBottomHeirarchy({
        staffId: userData?._id,
    });

    const { mutate: toggleStatus, isLoading: isToggling } = useInActiveStaff({
        onSuccess: () => {
            refetch();
            toast({
                title: "Success",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to toggle status",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        },
    });

    const handleToggle = (staffId, currentStatus) => {
        toggleStatus({ staffId });
    };

    if (isLoading) {
        return (
            <Center py={10}>
                <Spinner size="lg" />
            </Center>
        );
    }

    return (
        <Box p={6}>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                My Team
            </Text>

            <Box overflowX="auto" borderRadius="md" boxShadow="sm">
                <Table colorScheme="gray">
                    <Thead bg="gray.100">
                        <Tr>
                            <Th>Name</Th>
                            <Th>Contact</Th>
                            <Th>Email</Th>

                            <Th w="120px" textAlign="center">Status</Th> {/* Fixed width */}
                            <Th w="140px" textAlign="center">Actions</Th> {/* Fixed width */}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {teamList?.length ? (
                            teamList.map((staff) => (
                                <Tr key={staff._id} _hover={{ bg: "gray.50" }}>
                                    <Td fontWeight="medium">{staff.name}</Td>
                                    <Td>{staff.contact}</Td>
                                    <Td>{staff.email}</Td>
                                    <Td textAlign="center" color={staff.isActive ? "green.500" : "red.500"}>
                                        {staff.isActive ? "Active" : "Blocked"}
                                    </Td>
                                    <Td textAlign="center">
                                        <Button
                                            size="sm"
                                            colorScheme={staff.isActive ? "red" : "green"}
                                            variant="solid"
                                            onClick={() => handleToggle(staff._id, staff.isActive)}
                                            isLoading={isToggling}
                                        >
                                            {staff.isActive ? "Block" : "Unblock"}
                                        </Button>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={5} textAlign="center" py={6}>
                                    <Text>No team members found.</Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}
