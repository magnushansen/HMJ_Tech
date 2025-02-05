'use client';

import { useRouter } from "next/navigation"; // For programmatic navigation
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk hook for user info

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function JoinLobby() {
    const [lobbyId, setLobbyId] = useState(""); // State for input field
    const [error, setError] = useState(null); // State for errors
    const router = useRouter(); // Router for navigation
    const { user } = useUser(); // Clerk user details

    // Function to join a lobby
    const joinLobby = async () => {
        try {
            // Extract user email from Clerk
            const email = user?.emailAddresses[0]?.emailAddress || null;

            if (!email) {
                alert("User email not found!");
                return;
            }

            // Check if the lobby exists and is active
            const { data, error } = await supabase
                .from("session")
                .select("id, active, player_count")
                .eq("id", lobbyId)
                .eq("active", true)
                .single(); // Ensures we only get one lobby

            if (error || !data) {
                throw new Error("Lobby not found or is inactive.");
            }

            if (data.player_count > 4) {
                alert("Lobby is full.");
                return;
            }

            // Update the player count in the lobby
            const { error: updateError } = await supabase
                .from("session")
                .update({ player_count: data.player_count + 1 })
                .eq("id", lobbyId);

            if (updateError) {
                throw new Error("Failed to join the lobby. Please try again.");
            }

            // Step 2: Match email in `user_data` and update the `session_id`
            const { error: userUpdateError } = await supabase
                .from('user_data')
                .update({ session_id: lobbyId }) // Update with the session ID
                .eq('email', email); // Match by email

            if (userUpdateError) {
                console.error('Error updating user_data with session ID:', userUpdateError.message);
                alert('Failed to update user_data with session ID');
                return;
            }

            console.log('User data updated successfully with session ID.');

            // Redirect to the lobby page
            router.push(`/createlobby/${lobbyId}`);

        } catch (err) {
            setError(err.message || "Failed to join lobby. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Sjavs</h1>
            </div>

            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <h2 className="text-4xl font-bold mb-4">Join Lobby</h2>

                <div className="flex flex-col items-center">
                    {/* Lobby ID Input */}
                    <input
                        type="text"
                        value={lobbyId}
                        onChange={(e) => setLobbyId(e.target.value)}
                        placeholder="Enter Lobby ID"
                        className="block w-60 bg-white text-black text-center font-semibold py-3 px-6 rounded shadow-md mb-4"
                    />

                    {/* Join Lobby Button */}
                    <button
                        onClick={joinLobby}
                        className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                    >
                        Join Lobby
                    </button>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 mt-4">{error}</p>
                    )}

                    {/* Back to Main Menu */}
                    <button
                        onClick={() => router.push("/")}
                        className="block w-48 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105 mt-4"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
}