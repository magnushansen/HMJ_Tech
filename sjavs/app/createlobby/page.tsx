'use client';

import { useRouter } from "next/navigation"; // For programmatic navigation
import React, { useState } from "react";
import supabase from "../../lib/supabase";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs"; // Clerk hook for user info

export default function CreateLobby() {
    const [error, setError] = useState(null); // State for errors
    const router = useRouter(); // Router for navigation
    const { user } = useUser(); // Clerk user details

    const createSession = async () => {
        try {
            // Extract user email from Clerk
            const email = user?.emailAddresses[0]?.emailAddress || null;

            if (!email) {
                alert("User email not found!");
                return;
            }

            // Step 1: Insert a new session in the `session` table
            const { data: sessionData, error: sessionError } = await supabase
                .from('session')
                .insert({
                    active: true, // Session is active
                    player_count: 1, // Initial player count
                })
                .select() // Fetch the inserted data
                .single(); // Get a single object (session)

            if (sessionError) {
                console.error('Error creating session:', sessionError.message);
                alert('Failed to create session');
                return;
            }

            console.log('Session created successfully:', sessionData);

            // Step 2: Match email in `user_data` and update the `session_id`
            const { error: updateError } = await supabase
                .from('user_data')
                .update({ session_id: sessionData.id }) // Update with the session ID
                .eq('email', email); // Match by email

            if (updateError) {
                console.error('Error updating user_data with session ID:', updateError.message);
                alert('Failed to update user_data with session ID');
                return;
            }

            console.log('User data updated successfully with session ID.');

            // Navigate to the created lobby page
            router.push(`/createlobby/${sessionData.id}`);
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Sjavs</h1>
            </div>

            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <h2 className="text-4xl font-bold mb-4">Create Lobby</h2>
                {user ? (
                    <p className="text-lg mb-6">Welcome, {user.username || "Anonymous"}!</p>
                ) : (
                    <p className="text-lg mb-6">Loading user data...</p>
                )}

                <ul className="space-y-4 flex flex-col items-center">
                    <li>
                        <button
                            onClick={() => createSession()}
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Create Private Session
                        </button>
                    </li>
                    <li>
                        <Link
                            href=".."
                            className="block w-48 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Main Menu
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
