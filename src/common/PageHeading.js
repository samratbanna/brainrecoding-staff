import { Box, Divider, Heading } from '@chakra-ui/react';
import React from 'react'

export const PageHeading = (props) => {
    const { heading, desc } = props;

    return (
        <Box mb={6}>
            {
                heading && 
                <Heading color='gray.700' fontSize={{ base: 'xl', lg: '3xl' }}>{heading}</Heading>
            }
            {
                desc && 
                <Box color='gray.500' fontSize={{ lg: 'md' }}>{desc}</Box>
            }
        </Box>
    )
}
