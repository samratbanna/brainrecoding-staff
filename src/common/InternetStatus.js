import { Box, HStack, Text, Button } from "@chakra-ui/react"
import { GoCloudOffline } from "react-icons/go"
import { useState, useEffect } from "react"

export const InternetStatus = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleReload = () => {
        window.location.reload();
    }

    return (
        <Box pos='relative'>
            {children}
            {!isOnline ?
                <Box borderRadius='lg' bg='white' pos='fixed' zIndex={99} top='580px' left={10} border='1px solid' borderColor='gray.100' w='280px' px={4} pt={3}>
                    <HStack spacing={2}>
                        <Box><GoCloudOffline /></Box>
                        <Text fontSize='14px' fontWeight='bold'>Looks like you are offline</Text>
                    </HStack>
                    <Text fontSize='12px' my={2} color='gray.500'>
                        Until you &apos;re back online, data in your workspace may not be up to date.
                    </Text>
                    <Button size='sm' colorScheme='defaultColor' my={4} onClick={handleReload}>Reload</Button>
                </Box>
                :
                null
            }
        </Box>
    )
}