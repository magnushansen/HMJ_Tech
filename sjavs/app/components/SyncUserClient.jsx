"use client";

import { useSyncUser } from "../../hooks/useSyncUser";

export default function SyncUserClient() {
    useSyncUser(); // Run the hook inside a component wrapped by <ClerkProvider>
    return null; // No UI rendering is needed
}
