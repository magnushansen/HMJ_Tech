'use client'

import { useRouter } from "next/navigation"; // For programmatic navigation
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateLobby() {
    const [error, setError] = useState(null); // State for errors
    const router = useRouter(); // Router for navigation

    // Function to create a lobby
    const createLobby = async () => {
        try {
            // Insert a new session (lobby) into the database
            const { data, error } = await supabase
                .from("session")
                .insert({
                    public: true, // Default to public since there's no distinction now
                    active: true, // Marks the session as active
                    count: 0, // Initial player count
                })
                .select() // Fetch the inserted data to get the ID
                .single(); // Ensures we get a single object instead of an array

            if (error) {
                throw error;
            }

            // Redirect to the new lobby page with the session ID
            router.push(`/createlobby/${data.id}`);
        } catch (err) {
            setError("Failed to create lobby. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Sjavs</h1>
            </div>

            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <h2 className="text-4xl font-bold mb-4">Lobby Menu</h2>

                <ul className="space-y-4 flex flex-col items-center">
                    {/* Create Lobby Button */}
                    <li>
                        <button
                            onClick={createLobby} // Create a lobby
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Create Lobby
                        </button>
                    </li>
                    
                    {/* Join Lobby Button */}
                    <li>
                        <button
                            onClick={() => router.push("/joinlobby")} // Redirect to Join Lobby page
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Join Lobby
                        </button>
                    </li>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 mt-4">{error}</p>
                    )}
                    
                    {/* Main Menu Button */}
                    <li>
                        <button
                            onClick={() => router.push("/")} // Navigate back to the main menu
                            className="block w-48 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Main Menu
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
