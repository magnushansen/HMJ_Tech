"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs"; // Clerk hooks
import { createClient } from "@supabase/supabase-js"; // Supabase client

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const useSyncUser = () => {
    const { isLoaded, userId } = useAuth(); // Clerk authentication state
    const { user } = useUser(); // Clerk user details

    useEffect(() => {
        // Ensure Clerk is fully loaded and a user is authenticated
        if (!isLoaded || !userId || !user) return;

        const syncUserWithSupabase = async () => {
            try {
                // Extract relevant user data from Clerk
                const { emailAddresses, username } = user;
                const email = emailAddresses[0]?.emailAddress || null; // Get the user's primary email

                // Insert or update the user in the Supabase `user_data` table
                const { error } = await supabase
                    .from("user_data")
                    .upsert({
                        //User_id: userId, // Use Clerk's userId
                        email: email, // User's email
                        username: username || "Anonymous", // Use Clerk's username or a default value
                    });

                if (error) {
                    console.error("Failed to sync user with Supabase:", error);
                } else {
                    console.log("User successfully synced with Supabase!");
                }
            } catch (err) {
                console.error("Unexpected error syncing user with Supabase:", err);
            }
        };

        syncUserWithSupabase(); // Run the sync function
    }, [isLoaded, userId, user]); // Run whenever these values change
};
