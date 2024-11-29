"use client";

import "./globals.css";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import SyncUserClient from "./components/SyncUserClient"; // Import the SyncUserClient component

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="bg-green-800 m-0 p-0 h-screen">
                    <SyncUserClient /> {/* This ensures useSyncUser runs inside ClerkProvider */}
                    <SignedOut>
                        <SignInButton mode="modal" />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
