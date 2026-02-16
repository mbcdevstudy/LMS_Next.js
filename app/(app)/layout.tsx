import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'
import { SanityLive } from '@/sanity/lib/live'

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider

            appearance={{
                theme: dark,
            }}>
            <div>

                {children}
                <SanityLive />

            </div>
        </ClerkProvider>
    )
}

export default AppLayout