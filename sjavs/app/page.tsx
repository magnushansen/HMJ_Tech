'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Menu() {
    const [error, setError] = useState<string | null>(null); // State to handle errors
    const router = useRouter(); // For navigation

    // Function to create a lobby
    const createLobby = async () => {
        try {
            const { data, error } = await supabase
                .from("session")
                .insert({
                    public: true, // Toggle for public/private lobbies
                    active: true, // Active status
                    player_count: 0, // Correct column name
                })
                .select() // Fetch the created row
                .single(); // Ensure a single row is returned
    
            if (error) throw error;
    
            // Redirect to the new lobby page
            router.push(`/createlobby/${data.id}`);
        } catch (err) {
            setError(err.message || "Failed to create lobby. Please try again.");
            console.error("Supabase Error:", err);
        }
    };
    

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Sjavs</h1>
            </div>

            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <h2 className="text-4xl font-bold mb-4">Main Menu</h2>

                <ul className="space-y-4 flex flex-col items-center">
                    {/* Join Lobby Button */}
                    <li>
                        <Link
                            href="/joinlobby"
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Join Lobby
                        </Link>
                    </li>

                    {/* Create Lobby Button */}
                    <li>
                        <button
                            onClick={createLobby} // Call the createLobby function on click
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Create Lobby
                        </button>
                    </li>

                    {/* Tournament Button */}
                    <li>
                        <Link
                            href="/tournament"
                            className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                        >
                            Tournament
                        </Link>
                    </li>
                </ul>

                {/* Display error message */}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
