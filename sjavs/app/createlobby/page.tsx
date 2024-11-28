'use client'

import { useRouter } from "next/navigation"; // For programmatic navigation
import React,  { useState } from "react";
import supabase from "../../lib/supabase";
import Link from 'next/link';

export default function CreateLobby() {
    const [error, setError] = useState(null); // State for errors
    const router = useRouter(); // Router for navigation

    const createSession = async (isPrivate) => {
        try {
            // Insert a new session with specific values
            const { data, error } = await supabase
                .from('session')
                .insert({
                    public: !isPrivate, // private session
                    active: true,  // session is active
                    count: +1       // no players initially
                })
                .select() // Fetch the inserted data to get the ID
                .single(); // Ensures we get a single object instead of an array
        
            if (error) {
                console.error('Error creating private session:', error.message);
                alert('Failed to create session');
            } if (!isPrivate) {
                console.log('Private session created:', data);
                alert('Private session created successfully!');
                router.push(`/createlobby/${data.id}`);
            } else {
                console.log('Public session created: ', data);
                alert('Public lobby created!')
                router.push(`/createlobby/${data.id}`);
            }
            } catch (error) {
            console.error('Unexpected error:', error);
            }
        };

    return (
    <div className="h-screen bg-green-800 text-white font-sans">

        <div className="w-full text-center py-6">
            <h1 className="text-5xl font-extrabold">Sjavs</h1>
        </div>

        <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
            <h2 className="text-4xl font-bold mb-4">Create Lobby</h2>

            <ul className="space-y-4 flex flex-col items-center">
            <li>
                <button onClick={() => createSession(true)}
                className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                >
                Create Public Lobby
                </button>
            </li>
            <li>
                <button onClick={() => createSession(false)}
                className="block w-60 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105"
                >
                Create Private Lobby
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
