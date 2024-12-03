'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, redirect } from "next/navigation"; // For programmatic navigation
import supabase from '../../../lib/supabase'; // Import your Supabase client

const LobbyPage = () => {
    const params = useParams() as { lobbyId: string };
    const router = useRouter();
    const { lobbyId } = params; // Get lobbyId from the URL
    const [users, setUsers] = useState<{ email: string; username: string }[]>([]); // State to store users in the lobby
    const [error, setError] = useState<string | null>(null); // State for errors

    const updateUserCount = async (action: 'join' | 'leave') => {
        try {
            await fetch('/api/trackUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: lobbyId, action }),
            });
        } catch (error) {
            console.error(`Failed to update user count: ${action}`, error);
        }
    };

    const validateLobby = async () => {
        const { data, error } = await supabase
            .from("session")
            .select("id")
            .eq("id", lobbyId)
            .single();

        if (error || !data) {
            console.error("Error validating lobby:", error);
            redirect("/createlobby");
        }
    };

    const fetchUsersInLobby = async () => {
        const { data, error } = await supabase
            .from("user_data")
            .select("email, username")
            .eq("session_id", lobbyId);

        if (error) {
            console.error("Error fetching users in lobby:", error);
            setError("Failed to fetch users in lobby.");
        } else {
            setUsers(data);
        }
    };

    useEffect(() => {
        // Validate lobby existence
        validateLobby();

        // Fetch users in the lobby
        fetchUsersInLobby();

        // Increment user count when the component mounts
        updateUserCount('join');

        // Decrement user count when the component unmounts
        return () => {
            updateUserCount('leave');
        };
    }, [lobbyId, router]);

    return (
        <div className="h-screen bg-green-800 text-white font-sans">
            <div className="w-full text-center py-6">
                <h1 className="text-5xl font-extrabold">Lobby ID: {lobbyId}</h1>
            </div>
            <div className="flex flex-col items-center justify-start h-[calc(100vh-100px)] mt-[-10px]">
                <p className="text-lg mb-6">Share this lobby ID with your friends to join the game!</p>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Users in this Lobby:</h2>
                    <ul className="list-disc list-inside">
                        {users.map((user, index) => (
                            <li key={index}>{user.username || user.email}</li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="block w-48 bg-orange-500 hover:bg-orange-600 text-center text-white font-semibold py-3 px-6 rounded shadow-md transition-transform transform hover:scale-105 mt-4"
                >
                    Main Menu
                </button>
            </div>
        </div>
    );
};

export default LobbyPage;