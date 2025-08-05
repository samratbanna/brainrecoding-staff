'use client'
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const QueryClientProviderContainer = (props: any) => {

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }))
  
  return <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
}