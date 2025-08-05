'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react'
import { AuthProvider } from "../context/Auth"
import { CookiesProvider } from 'react-cookie'
import { customTheme } from "../theme"

const { ToastContainer, toast } = createStandaloneToast({
    theme: customTheme,
});

export function Providers({
    children
}) {
    return (
        <CacheProvider>
            {children.props?.childProp?.segment === 'createLead' ?
                <ChakraProvider theme={customTheme}>
                    {children}
                </ChakraProvider>
                :
                <ChakraProvider theme={customTheme}>
                    <AuthProvider>
                        <CookiesProvider>
                            {children}
                        </CookiesProvider>
                    </AuthProvider>
                </ChakraProvider>
            }
        </CacheProvider>
    )
}